const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();
const { authMiddleware, adminMiddleware } = require("./middleware/auth");
const db = admin.firestore();
const auth = admin.auth();

const app = express();

// --- Middleware Setup ---

// It's best practice to manage your allowed origins via environment variables.
// You can get these from the Firebase environment configuration.
// e.g., functions.config().cors.origins
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ["http://localhost:3000"]; // Fallback for local development

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes ---
// In a larger application, you would move these into separate route files (e.g., /routes/traders.js)

// Example route based on contracts.md to get you started
app.get("/api/traders", async (req, res) => {
  // TODO: Seed the traders collection in Firestore
  try {
    const tradersSnapshot = await db.collection('traders').get();
    const traders = tradersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, traders });
  } catch (error) {
    console.error("Error fetching traders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch traders." });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    const userDoc = {
      uid: userRecord.uid,
      email: userRecord.email,
      fullName: userRecord.displayName,
      role: 'user',
      balance: 0.0,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(userRecord.uid).set(userDoc);

    const customToken = await auth.createCustomToken(userRecord.uid);
    
    // Do not send password in the response
    const { password: _, ...userResponse } = userDoc;


    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token: customToken
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: "Failed to register user." });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
    const { uid } = req.user;

    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({ success: true, user: userDoc.data() });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user data." });
    }
});

app.post("/api/auth/logout", authMiddleware, async (req, res) => {
    const { uid } = req.user;

    try {
        await auth.revokeRefreshTokens(uid);
        res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ success: false, message: "Failed to log out." });
    }
});

app.get("/api/users", [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => doc.data());
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Failed to fetch users." });
    }
});

app.put("/api/users/:userId", [authMiddleware, adminMiddleware], async (req, res) => {
    const { userId } = req.params;
    const { status, balance, role } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (balance) updateData.balance = balance;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: "No update fields provided." });
    }

    try {
        await db.collection('users').doc(userId).update(updateData);
        res.status(200).json({ success: true, message: "User updated successfully." });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Failed to update user." });
    }
});

app.delete("/api/users/:userId", [authMiddleware, adminMiddleware], async (req, res) => {
    const { userId } = req.params;

    try {
        await auth.deleteUser(userId);
        await db.collection('users').doc(userId).delete();

        // TODO: Delete user's sessions, copy trades, and transactions as well.

        res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user." });
    }
});

app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
    const { uid } = req.user;

    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const user = userDoc.data();

        // TODO: Make sure 'copy_trades' and 'transactions' collections are seeded with data.
        const copyTradesSnapshot = await db.collection('copy_trades').where('userId', '==', uid).where('status', '==', 'active').get();
        const activeCopies = copyTradesSnapshot.size;

        const transactionsSnapshot = await db.collection('transactions').where('userId', '==', uid).where('type', '==', 'trade').get();
        const totalTrades = transactionsSnapshot.size;
        
        const totalProfit = copyTradesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().current_profit || 0), 0);
        const profitPercentage = user.balance > 0 ? (totalProfit / user.balance) * 100 : 0;

        res.status(200).json({
            success: true,
            portfolio: {
                balance: user.balance,
                profit: totalProfit,
                profit_percentage: Math.round(profitPercentage * 100) / 100,
                active_copies: activeCopies,
                total_trades: totalTrades,
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats." });
    }
});

app.get("/api/plans", async (req, res) => {
    try {
        // TODO: Seed the plans collection in Firestore
        const plansSnapshot = await db.collection('plans').where('is_active', '==', true).get();
        const plans = plansSnapshot.docs.map(doc => doc.data());
        res.status(200).json({ success: true, plans });
    } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(500).json({ success: false, message: "Failed to fetch plans." });
    }
});

// TODO: Seed the wallets collection in Firestore
app.get("/api/wallets", async (req, res) => {
    try {
        const walletsSnapshot = await db.collection('wallets').get();
        const wallets = walletsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, wallets });
    } catch (error) {
        console.error("Error fetching wallets:", error);
        res.status(500).json({ success: false, message: "Failed to fetch wallets." });
    }
});

app.get("/api/wallets/:method", async (req, res) => {
    const { method } = req.params;
    try {
        const walletDoc = await db.collection('wallets').doc(method).get();
        if (!walletDoc.exists) {
            return res.status(404).json({ success: false, message: "Wallet not found." });
        }
        res.status(200).json({ success: true, wallet: walletDoc.data() });
    } catch (error) {
        console.error("Error fetching wallet:", error);
        res.status(500).json({ success: false, message: "Failed to fetch wallet." });
    }
});

app.put("/api/wallets/:method", [authMiddleware, adminMiddleware], async (req, res) => {
    const { method } = req.params;
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ success: false, message: "Address is required." });
    }

    try {
        await db.collection('wallets').doc(method).set({ address }, { merge: true });
        res.status(200).json({ success: true, message: "Wallet updated successfully." });
    } catch (error) {
        console.error("Error updating wallet:", error);
        res.status(500).json({ success: false, message: "Failed to update wallet." });
    }
});

app.get("/api/admin/stats", [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        // TODO: Make sure all collections are seeded with data.
        const usersSnapshot = await db.collection('users').where('role', '==', 'user').get();
        const totalUsers = usersSnapshot.size;

        const tradersSnapshot = await db.collection('traders').where('is_active', '==', true).get();
        const totalTraders = tradersSnapshot.size;

        const transactionsSnapshot = await db.collection('transactions').get();
        const totalTransactions = transactionsSnapshot.size;

        const pendingTransactionsSnapshot = await db.collection('transactions').where('status', '==', 'pending').get();
        const pendingTransactions = pendingTransactionsSnapshot.size;

        const plansSnapshot = await db.collection('plans').where('is_active', '==', true).get();
        const totalPlans = plansSnapshot.size;

        const allUsersSnapshot = await db.collection('users').get();
        const totalPlatformBalance = allUsersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().balance || 0), 0);

        res.status(200).json({
            success: true,
            stats: {
                total_users: totalUsers,
                total_traders: totalTraders,
                total_transactions: totalTransactions,
                pending_transactions: pendingTransactions,
                total_plans: totalPlans,
                total_platform_balance: totalPlatformBalance,
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch admin stats." });
    }
});

// TODO: Seed the transactions collection in Firestore
app.get("/api/transactions", [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const transactionsSnapshot = await db.collection('transactions').get();
        const transactions = transactionsSnapshot.docs.map(doc => doc.data());
        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ success: false, message: "Failed to fetch transactions." });
    }
});

app.put("/api/transactions/:transactionId/approve", [authMiddleware, adminMiddleware], async (req, res) => {
    const { transactionId } = req.params;
    try {
        await db.collection('transactions').doc(transactionId).update({ status: 'completed' });
        res.status(200).json({ success: true, message: "Transaction approved." });
    } catch (error) {
        console.error("Error approving transaction:", error);
        res.status(500).json({ success: false, message: "Failed to approve transaction." });
    }
});

app.put("/api/transactions/:transactionId/reject", [authMiddleware, adminMiddleware], async (req, res) => {
    const { transactionId } = req.params;
    try {
        await db.collection('transactions').doc(transactionId).update({ status: 'rejected' });
        res.status(200).json({ success: true, message: "Transaction rejected." });
    } catch (error) {
        console.error("Error rejecting transaction:", error);
        res.status(500).json({ success: false, message: "Failed to reject transaction." });
    }
});

// A simple health-check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Firebase Function Export ---

// Expose the Express API as a single Cloud Function.
// This will create a single function endpoint (e.g., /api) that serves your entire Express app.
exports.api = functions.https.onRequest(app);