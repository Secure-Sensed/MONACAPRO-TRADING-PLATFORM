const path = require("path");
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const { authMiddleware, adminMiddleware } = require("./middleware/auth");
const { sendWelcomeEmail } = require("./services/emailService");
const { getAllWallets, getWalletByMethod } = require("./services/walletService");
const { initFirebase } = require("./services/firebase");
const { ensureAdminUser } = require("./services/adminSeed");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || "8001");
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const MIN_DEPOSIT = Number(process.env.MIN_DEPOSIT || "250");
const MIN_WITHDRAWAL = Number(process.env.MIN_WITHDRAWAL || "100");
const MAX_WITHDRAWAL = Number(process.env.MAX_WITHDRAWAL || "100000");
const MAX_DEPOSIT = Number(process.env.MAX_DEPOSIT || "1000000");

const app = express();
const admin = initFirebase();

const corsOrigins = process.env.CORS_ORIGINS || "*";
const allowedOrigins =
  corsOrigins === "*" ? "*" : corsOrigins.split(",").map((origin) => origin.trim()).filter(Boolean);

const corsOptions =
  allowedOrigins === "*"
    ? { origin: "*", credentials: false }
    : {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error("CORS not allowed"), false);
        },
        credentials: true,
      };

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const normalizeValue = (value) => {
  if (value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return value;
};

const normalizeRecord = (record) => {
  const normalized = {};
  Object.entries(record || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      normalized[key] = value.map((item) => normalizeValue(item));
    } else {
      normalized[key] = normalizeValue(value);
    }
  });
  return normalized;
};

const docToData = (doc, idField) => {
  const data = doc.data() || {};
  const withId = idField && !data[idField] ? { ...data, [idField]: doc.id } : data;
  return normalizeRecord(withId);
};

const resolveUserRef = async (db, userId) => {
  const directRef = db.collection("users").doc(userId);
  const directSnap = await directRef.get();
  if (directSnap.exists) {
    return directRef;
  }
  const snapshot = await db.collection("users").where("user_id", "==", userId).limit(1).get();
  if (!snapshot.empty) {
    return snapshot.docs[0].ref;
  }
  return null;
};

const deleteByField = async (collectionRef, field, value) => {
  let deleted = 0;
  while (true) {
    const snapshot = await collectionRef.where(field, "==", value).limit(500).get();
    if (snapshot.empty) {
      break;
    }
    const batch = collectionRef.firestore.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += snapshot.size;
    if (snapshot.size < 500) {
      break;
    }
  }
  return deleted;
};

const firebaseAuthRequest = async (endpoint, payload) => {
  if (!FIREBASE_API_KEY) {
    const error = new Error("FIREBASE_API_KEY is not set");
    error.status = 500;
    throw error;
  }

  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${FIREBASE_API_KEY}`,
    payload,
    {
      timeout: 10000,
      validateStatus: () => true,
    }
  );

  if (response.status !== 200) {
    const message = response.data?.error?.message || "Firebase Auth request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.data;
};

const upsertUserFromFirebase = async (db, firebaseUser) => {
  const userRef = db.collection("users").doc(firebaseUser.uid);
  const existingDoc = await userRef.get();

  if (existingDoc.exists) {
    const data = existingDoc.data() || {};
    const merged = {
      user_id: data.user_id || firebaseUser.uid,
      firebase_uid: data.firebase_uid || firebaseUser.uid,
      ...data,
    };
    if (!data.user_id || !data.firebase_uid) {
      await userRef.set(
        {
          user_id: firebaseUser.uid,
          firebase_uid: firebaseUser.uid,
          updated_at: new Date(),
        },
        { merge: true }
      );
    }
    return { uid: firebaseUser.uid, ...merged };
  }

  if (firebaseUser.email) {
    const snapshot = await db.collection("users").where("email", "==", firebaseUser.email).limit(1).get();
    if (!snapshot.empty) {
      const existingData = snapshot.docs[0].data();
      const merged = {
        ...existingData,
        firebase_uid: firebaseUser.uid,
        user_id: existingData.user_id || firebaseUser.uid,
        updated_at: new Date(),
      };
      await userRef.set(merged, { merge: true });
      return { uid: firebaseUser.uid, ...merged };
    }
  }

  const now = new Date();
  const newUser = {
    firebase_uid: firebaseUser.uid,
    user_id: firebaseUser.uid,
    email: firebaseUser.email,
    full_name:
      firebaseUser.displayName ||
      firebaseUser.name ||
      (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Monacap User"),
    picture: firebaseUser.photoURL || firebaseUser.picture || null,
    role: "user",
    balance: 0.0,
    status: "active",
    created_at: now,
  };

  await userRef.set(newUser);
  return { uid: firebaseUser.uid, ...newUser };
};

const db = admin.firestore();
ensureAdminUser(admin, db).catch((error) => {
  console.warn("Admin seed failed:", error.message || error);
});

const requireAuth = authMiddleware(db, admin);
const requireAdmin = adminMiddleware(db, admin);

app.get(
    "/api/auth/me",
    requireAuth,
    asyncHandler(async (req, res) => {
      res.status(200).json({ success: true, user: normalizeRecord(req.user) });
    })
  );

app.post(
    "/api/auth/register",
    asyncHandler(async (req, res) => {
      const fullName = req.body.full_name || req.body.fullName;
      const { email, password } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, detail: "Missing required fields" });
      }

      const firebaseData = await firebaseAuthRequest("accounts:signUp", {
        email,
        password,
        returnSecureToken: true,
      });

      await admin.auth().updateUser(firebaseData.localId, { displayName: fullName });
      const firebaseUser = await admin.auth().getUser(firebaseData.localId);
      const user = await upsertUserFromFirebase(db, firebaseUser);

      sendWelcomeEmail({
        userName: user.full_name,
        userEmail: user.email,
        userId: user.user_id,
      }).catch((error) => {
        console.warn("Welcome email failed:", error.message || error);
      });

      res.status(200).json({
        success: true,
        message: "User registered successfully",
        user: normalizeRecord(user),
        token: firebaseData.idToken,
      });
    })
  );

app.post(
    "/api/auth/login",
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, detail: "Email and password required" });
      }

      const firebaseData = await firebaseAuthRequest("accounts:signInWithPassword", {
        email,
        password,
        returnSecureToken: true,
      });

      const firebaseUser = await admin.auth().getUser(firebaseData.localId);
      const user = await upsertUserFromFirebase(db, firebaseUser);

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: normalizeRecord(user),
        token: firebaseData.idToken,
      });
    })
  );

app.post(
    "/api/auth/logout",
    requireAuth,
    asyncHandler(async (req, res) => {
      const uid = req.firebaseToken.uid;
      await admin.auth().revokeRefreshTokens(uid);
      res.status(200).json({ success: true, message: "Logged out successfully" });
    })
  );

app.post(
    "/api/auth/change-password",
    requireAuth,
    asyncHandler(async (_req, res) => {
      res.status(501).json({
        success: false,
        detail: "Use Firebase client SDK to change passwords.",
      });
    })
  );

app.get(
    "/api/users",
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const snapshot = await db.collection("users").get();
      const users = snapshot.docs.map((doc) => {
        const data = doc.data() || {};
        const sanitized = {
          ...data,
          user_id: data.user_id || doc.id,
        };
        delete sanitized.password;
        return normalizeRecord(sanitized);
      });
      res.status(200).json({ success: true, users });
    })
  );

app.put(
    "/api/users/:userId",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const { status, balance, role } = req.body;
      const updateData = {};

      if (status !== undefined) updateData.status = status;
      if (balance !== undefined) updateData.balance = balance;
      if (role !== undefined) updateData.role = role;

      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date();
        const userRef = await resolveUserRef(db, userId);
        if (!userRef) {
          return res.status(404).json({ success: false, detail: "User not found" });
        }
        await userRef.set(updateData, { merge: true });
      }

      res.status(200).json({ success: true, message: "User updated" });
    })
  );

app.delete(
    "/api/users/:userId",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const userRef = await resolveUserRef(db, userId);
      if (!userRef) {
        return res.status(404).json({ success: false, detail: "User not found" });
      }
      await userRef.delete();
      await deleteByField(db.collection("copy_trades"), "user_id", userId);
      await deleteByField(db.collection("transactions"), "user_id", userId);
      res.status(200).json({ success: true, message: "User deleted" });
    })
  );

app.get(
    "/api/traders",
    asyncHandler(async (_req, res) => {
      const snapshot = await db.collection("traders").where("is_active", "==", true).get();
      const traders = snapshot.docs.map((doc) => docToData(doc, "trader_id"));
      res.status(200).json({ success: true, traders });
    })
  );

app.post(
    "/api/traders",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const traderId = `trader_${crypto.randomBytes(6).toString("hex")}`;
      const now = new Date();
      const traderDoc = {
        trader_id: traderId,
        name: req.body.name,
        image: req.body.image,
        profit: req.body.profit,
        risk: req.body.risk,
        win_rate: req.body.win_rate,
        followers: 0,
        trades: 0,
        is_active: true,
        created_at: now,
      };

      await db.collection("traders").doc(traderId).set(traderDoc);
      const trader = normalizeRecord(traderDoc);

      res.status(200).json({ success: true, trader });
    })
  );

app.get(
    "/api/dashboard/stats",
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.user.user_id;

      const activeCopiesSnapshot = await db
        .collection("copy_trades")
        .where("user_id", "==", userId)
        .where("status", "==", "active")
        .get();

      const totalTradesSnapshot = await db
        .collection("transactions")
        .where("user_id", "==", userId)
        .where("type", "==", "trade")
        .get();

      const copyTrades = activeCopiesSnapshot.docs.map((doc) => doc.data() || {});

      const totalProfit = copyTrades.reduce(
        (sum, trade) => sum + (trade.current_profit || 0),
        0
      );
      const profitPercentage =
        req.user.balance > 0 ? (totalProfit / req.user.balance) * 100 : 0;

      res.status(200).json({
        success: true,
        portfolio: {
          balance: req.user.balance,
          profit: totalProfit,
          profit_percentage: Math.round(profitPercentage * 100) / 100,
          active_copies: activeCopiesSnapshot.size,
          total_trades: totalTradesSnapshot.size,
          profitPercentage: Math.round(profitPercentage * 100) / 100,
          activeCopies: activeCopiesSnapshot.size,
          totalTrades: totalTradesSnapshot.size,
        },
      });
    })
  );

app.get(
    "/api/plans",
    asyncHandler(async (_req, res) => {
      const snapshot = await db.collection("plans").where("is_active", "==", true).get();
      const plans = snapshot.docs.map((doc) => docToData(doc, "plan_id"));
      res.status(200).json({ success: true, plans });
    })
  );

app.get(
    "/api/wallets",
    asyncHandler(async (_req, res) => {
      const wallets = await getAllWallets(db);
      res.status(200).json({ success: true, wallets });
    })
  );

app.get(
    "/api/wallets/:method",
    asyncHandler(async (req, res) => {
      const method = req.params.method.toLowerCase();
      const wallet = await getWalletByMethod(db, method);
      if (!wallet) {
        return res.status(404).json({ success: false, detail: "Payment method not found" });
      }
      res.status(200).json({ success: true, method, wallet });
    })
  );

app.get(
    "/api/transactions/me",
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.user.user_id;
      const snapshot = await db
        .collection("transactions")
        .where("user_id", "==", userId)
        .get();
      const transactions = snapshot.docs
        .map((doc) => docToData(doc, "transaction_id"))
        .sort((a, b) => {
          const dateA = new Date(a.date || a.created_at || 0).getTime();
          const dateB = new Date(b.date || b.created_at || 0).getTime();
          return dateB - dateA;
        });
      res.status(200).json({ success: true, transactions });
    })
  );

app.post(
    "/api/transactions",
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.user.user_id;
      const { type, amount, method, asset, details } = req.body;

      if (!type || !amount) {
        return res.status(400).json({ success: false, detail: "Type and amount are required" });
      }

      if (!["deposit", "withdrawal", "trade"].includes(type)) {
        return res.status(400).json({ success: false, detail: "Invalid transaction type" });
      }

      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ success: false, detail: "Amount must be greater than 0" });
      }

      if ((type === "deposit" || type === "withdrawal") && !method) {
        return res.status(400).json({ success: false, detail: "Payment method is required" });
      }

      if (type === "deposit" && numericAmount < MIN_DEPOSIT) {
        return res.status(400).json({
          success: false,
          detail: `Minimum deposit is ${MIN_DEPOSIT}`,
        });
      }

      if (type === "deposit" && numericAmount > MAX_DEPOSIT) {
        return res.status(400).json({
          success: false,
          detail: `Maximum deposit is ${MAX_DEPOSIT}`,
        });
      }

      if (type === "withdrawal" && numericAmount < MIN_WITHDRAWAL) {
        return res.status(400).json({
          success: false,
          detail: `Minimum withdrawal is ${MIN_WITHDRAWAL}`,
        });
      }

      if (type === "withdrawal" && numericAmount > MAX_WITHDRAWAL) {
        return res.status(400).json({
          success: false,
          detail: `Maximum withdrawal is ${MAX_WITHDRAWAL}`,
        });
      }

      if (type === "withdrawal") {
        if (!details || !details.address) {
          return res.status(400).json({
            success: false,
            detail: "Withdrawal address is required",
          });
        }
        const userRef = await resolveUserRef(db, userId);
        const userSnap = await userRef?.get();
        const balance = userSnap?.data()?.balance ?? req.user.balance ?? 0;
        if (numericAmount > balance) {
          return res.status(400).json({ success: false, detail: "Insufficient balance" });
        }
      }

      const transactionId = `txn_${crypto.randomBytes(8).toString("hex")}`;
      const now = new Date();
      const transactionDoc = {
        transaction_id: transactionId,
        user_id: userId,
        user_email: req.user.email || null,
        user_name: req.user.full_name || null,
        type,
        amount: numericAmount,
        method: method || null,
        asset: asset || null,
        details: details || null,
        status: "pending",
        date: now,
        created_at: now,
      };

      await db.collection("transactions").doc(transactionId).set(transactionDoc);

      res.status(201).json({
        success: true,
        message: "Transaction submitted",
        transaction: normalizeRecord(transactionDoc),
      });
    })
  );

app.put(
    "/api/profile",
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.user.user_id;
      const { full_name, phone, country, picture } = req.body || {};

      if (!full_name && !phone && !country && !picture) {
        return res.status(400).json({ success: false, detail: "No profile updates provided" });
      }

      const userRef = await resolveUserRef(db, userId);
      if (!userRef) {
        return res.status(404).json({ success: false, detail: "User not found" });
      }

      const updateData = { updated_at: new Date() };
      if (full_name) updateData.full_name = full_name;
      if (phone) updateData.phone = phone;
      if (country) updateData.country = country;
      if (picture) updateData.picture = picture;

      await userRef.set(updateData, { merge: true });

      if (full_name) {
        await admin.auth().updateUser(userId, { displayName: full_name });
      }

      const updatedSnap = await userRef.get();
      const updatedUser = updatedSnap.exists ? updatedSnap.data() : null;

      res.status(200).json({
        success: true,
        message: "Profile updated",
        user: normalizeRecord(updatedUser),
      });
    })
  );

app.put(
    "/api/wallets/:method",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const method = req.params.method.toLowerCase();
      const { address } = req.body;

      if (!address) {
        return res.status(400).json({ success: false, detail: "Address required" });
      }

      await db
        .collection("wallet_addresses")
        .doc(method)
        .set({ method, address, updated_at: new Date() }, { merge: true });

      res.status(200).json({ success: true, message: "Wallet address updated" });
    })
  );

app.post(
    "/api/admin/users/:userId/suspend",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const userRef = await resolveUserRef(db, userId);
      if (!userRef) {
        return res.status(404).json({ success: false, detail: "User not found" });
      }
      await userRef.set({ status: "inactive", updated_at: new Date() }, { merge: true });
      res.status(200).json({ success: true, message: "User account suspended" });
    })
  );

app.post(
    "/api/admin/users/:userId/activate",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const userRef = await resolveUserRef(db, userId);
      if (!userRef) {
        return res.status(404).json({ success: false, detail: "User not found" });
      }
      await userRef.set({ status: "active", updated_at: new Date() }, { merge: true });
      res.status(200).json({ success: true, message: "User account activated" });
    })
  );

app.get(
    "/api/admin/users/:userId/balance",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const userRef = await resolveUserRef(db, userId);
      if (!userRef) {
        return res.status(404).json({ success: false, detail: "User not found" });
      }
      const userSnap = await userRef.get();
      const user = userSnap.exists ? userSnap.data() : null;

      if (!user) {
        return res.status(404).json({ success: false, detail: "User not found" });
      }

      res.status(200).json({
        success: true,
        user_id: userId,
        balance: user.balance,
        email: user.email,
        full_name: user.full_name,
      });
    })
  );

app.put(
    "/api/admin/users/:userId/balance",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const { balance } = req.body;

      if (balance === undefined) {
        return res.status(400).json({ success: false, detail: "Balance amount required" });
      }

      const userRef = await resolveUserRef(db, userId);
      if (!userRef) {
        return res.status(404).json({ success: false, detail: "User not found" });
      }
      await userRef.set(
        { balance: Number(balance), updated_at: new Date() },
        { merge: true }
      );

      res.status(200).json({ success: true, message: "Balance updated successfully" });
    })
  );

app.get(
    "/api/transactions",
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const snapshot = await db.collection("transactions").get();
      const transactions = snapshot.docs.map((doc) => docToData(doc, "transaction_id"));
      res.status(200).json({ success: true, transactions });
    })
  );

app.put(
    "/api/transactions/:transactionId/approve",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { transactionId } = req.params;
      const snapshot = await db
        .collection("transactions")
        .where("transaction_id", "==", transactionId)
        .limit(1)
        .get();
      if (snapshot.empty) {
        return res.status(404).json({ success: false, detail: "Transaction not found" });
      }
      const txDoc = snapshot.docs[0];
      const txData = txDoc.data() || {};
      if (txData.status && txData.status !== "pending") {
        return res.status(400).json({ success: false, detail: "Transaction already processed" });
      }

      const userId = txData.user_id;
      const amount = Number(txData.amount || 0);
      if (userId && Number.isFinite(amount)) {
        const userRef = await resolveUserRef(db, userId);
        if (userRef) {
          const userSnap = await userRef.get();
          const balance = userSnap.exists ? userSnap.data()?.balance || 0 : 0;
          let newBalance = balance;
          if (txData.type === "deposit") {
            newBalance = balance + amount;
          } else if (txData.type === "withdrawal") {
            newBalance = balance - amount;
            if (newBalance < 0) {
              return res.status(400).json({ success: false, detail: "Insufficient balance" });
            }
          }
          await userRef.set({ balance: newBalance, updated_at: new Date() }, { merge: true });
        }
      }

      await txDoc.ref.set(
        {
          status: "completed",
          processed_by: req.user.user_id,
          processed_at: new Date(),
        },
        { merge: true }
      );

      res.status(200).json({ success: true, message: "Transaction approved" });
    })
  );

app.put(
    "/api/transactions/:transactionId/reject",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { transactionId } = req.params;
      const snapshot = await db
        .collection("transactions")
        .where("transaction_id", "==", transactionId)
        .limit(1)
        .get();
      if (snapshot.empty) {
        return res.status(404).json({ success: false, detail: "Transaction not found" });
      }
      const txDoc = snapshot.docs[0];
      const txData = txDoc.data() || {};
      if (txData.status && txData.status !== "pending") {
        return res.status(400).json({ success: false, detail: "Transaction already processed" });
      }

      await txDoc.ref.set(
        {
          status: "rejected",
          processed_by: req.user.user_id,
          processed_at: new Date(),
        },
        { merge: true }
      );

      res.status(200).json({ success: true, message: "Transaction rejected" });
    })
  );

app.get(
    "/api/admin/stats",
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const totalUsersSnapshot = await db.collection("users").where("role", "==", "user").get();
      const activeUsersSnapshot = await db
        .collection("users")
        .where("role", "==", "user")
        .where("status", "==", "active")
        .get();
      const totalTradersSnapshot = await db.collection("traders").where("is_active", "==", true).get();
      const totalTransactionsSnapshot = await db.collection("transactions").get();
      const pendingTransactionsSnapshot = await db
        .collection("transactions")
        .where("status", "==", "pending")
        .get();
      const totalPlansSnapshot = await db.collection("plans").where("is_active", "==", true).get();

      const revenueSnapshot = await db
        .collection("transactions")
        .where("type", "==", "deposit")
        .where("status", "==", "completed")
        .get();
      const pendingWithdrawalsSnapshot = await db
        .collection("transactions")
        .where("type", "==", "withdrawal")
        .where("status", "==", "pending")
        .get();

      const totalPlatformBalance = totalUsersSnapshot.docs.reduce(
        (sum, doc) => sum + (doc.data()?.balance || 0),
        0
      );

      const totalRevenue = revenueSnapshot.docs.reduce(
        (sum, doc) => sum + (doc.data()?.amount || 0),
        0
      );

      const totalUsers = totalUsersSnapshot.size;
      const activeUsers = activeUsersSnapshot.size;
      const totalTraders = totalTradersSnapshot.size;
      const totalTransactions = totalTransactionsSnapshot.size;
      const pendingTransactions = pendingTransactionsSnapshot.size;
      const totalPlans = totalPlansSnapshot.size;
      const pendingWithdrawals = pendingWithdrawalsSnapshot.size;

      res.status(200).json({
        success: true,
        stats: {
          total_users: totalUsers,
          total_traders: totalTraders,
          total_transactions: totalTransactions,
          pending_transactions: pendingTransactions,
          total_plans: totalPlans,
          total_platform_balance: totalPlatformBalance,
          totalUsers,
          activeUsers,
          totalRevenue,
          pendingWithdrawals,
        },
      });
    })
  );

app.get(
    "/health",
    asyncHandler(async (_req, res) => {
      try {
        await db.collection("_health").limit(1).get();
        res.status(200).json({
          status: "healthy",
          service: "monacaptradingpro-backend",
          database: "connected",
        });
      } catch (error) {
        res.status(500).json({
          status: "unhealthy",
          service: "monacaptradingpro-backend",
          database: "disconnected",
          error: error.message || String(error),
        });
      }
    })
  );

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ success: false, detail: err.message || "Internal server error" });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

module.exports = app;
