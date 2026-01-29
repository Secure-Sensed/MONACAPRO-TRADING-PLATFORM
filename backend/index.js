const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { authMiddleware, adminMiddleware } = require("./middleware/auth");
const { sendWelcomeEmail } = require("./services/emailService");
const { getAllWallets, getWalletByMethod } = require("./services/walletService");
const { initDb, query } = require("./services/db");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || "8001");
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const MIN_DEPOSIT = Number(process.env.MIN_DEPOSIT || "250");
const MIN_WITHDRAWAL = Number(process.env.MIN_WITHDRAWAL || "100");
const MAX_WITHDRAWAL = Number(process.env.MAX_WITHDRAWAL || "100000");
const MAX_DEPOSIT = Number(process.env.MAX_DEPOSIT || "1000000");


const app = express();
app.set("trust proxy", 1);

const corsOrigins = process.env.CORS_ORIGINS || "*";
const allowedOrigins =
  corsOrigins === "*"
    ? "*"
    : corsOrigins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

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
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const mapUser = (row) => {
  if (!row) return null;
  return {
    user_id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role,
    status: row.status,
    balance: parseNumber(row.balance, 0),
    phone: row.phone,
    country: row.country,
    picture: row.picture,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

const mapTransaction = (row) => ({
  transaction_id: row.id,
  user_id: row.user_id,
  type: row.type,
  amount: parseNumber(row.amount),
  method: row.method,
  asset: row.asset,
  details: row.details,
  status: row.status,
  processed_by: row.processed_by,
  processed_at: row.processed_at,
  date: row.created_at,
  created_at: row.created_at,
});

const createToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

initDb().catch((error) => {
  console.error("Database init failed:", error);
});

app.get(
  "/api/auth/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, user: mapUser(req.user) });
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

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, detail: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await query(
      `INSERT INTO users (id, email, password_hash, full_name, role, status, balance)
       VALUES ($1, $2, $3, $4, 'user', 'active', 0)`,
      [userId, email, passwordHash, fullName]
    );

    const userResult = await query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    sendWelcomeEmail({
      userName: user.full_name,
      userEmail: user.email,
      userId: user.id,
    }).catch((error) => {
      console.warn("Welcome email failed:", error.message || error);
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: mapUser(user),
      token: createToken(user),
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

    const userResult = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, detail: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      return res.status(400).json({ success: false, detail: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: mapUser(user),
      token: createToken(user),
    });
  })
);

app.post(
  "/api/auth/logout",
  asyncHandler(async (_req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  })
);

app.post(
  "/api/auth/change-password",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, detail: "Missing password fields" });
    }

    const passwordOk = await bcrypt.compare(current_password, req.user.password_hash);
    if (!passwordOk) {
      return res.status(400).json({ success: false, detail: "Current password incorrect" });
    }

    const hash = await bcrypt.hash(new_password, 10);
    await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
      hash,
      req.user.id,
    ]);

    res.status(200).json({ success: true, message: "Password updated successfully" });
  })
);

app.get(
  "/api/users",
  adminMiddleware,
  asyncHandler(async (_req, res) => {
    const result = await query("SELECT * FROM users");
    const users = result.rows.map((row) => mapUser(row));
    res.status(200).json({ success: true, users });
  })
);

app.put(
  "/api/users/:userId",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status, balance, role } = req.body;

    const userResult = await query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, detail: "User not found" });
    }

    await query(
      `UPDATE users
       SET status = COALESCE($1, status),
           balance = COALESCE($2, balance),
           role = COALESCE($3, role),
           updated_at = NOW()
       WHERE id = $4`,
      [status ?? null, balance ?? null, role ?? null, userId]
    );

    res.status(200).json({ success: true, message: "User updated" });
  })
);

app.delete(
  "/api/users/:userId",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await query("DELETE FROM users WHERE id = $1", [userId]);
    res.status(200).json({ success: true, message: "User deleted" });
  })
);

app.get(
  "/api/traders",
  asyncHandler(async (_req, res) => {
    const result = await query("SELECT * FROM traders WHERE is_active = TRUE");
    const traders = result.rows.map((row) => ({
      trader_id: row.id,
      name: row.name,
      image: row.image,
      profit: row.profit,
      risk: row.risk,
      win_rate: row.win_rate,
      followers: row.followers,
      trades: row.trades,
      is_active: row.is_active,
      created_at: row.created_at,
    }));
    res.status(200).json({ success: true, traders });
  })
);

app.post(
  "/api/traders",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const traderId = uuidv4();
    const now = new Date();

    await query(
      `INSERT INTO traders (id, name, image, profit, risk, win_rate, followers, trades, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 0, 0, TRUE, $7)`,
      [traderId, req.body.name, req.body.image, req.body.profit, req.body.risk, req.body.win_rate, now]
    );

    res.status(200).json({
      success: true,
      trader: {
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
      },
    });
  })
);

app.post(
  "/api/copy/start",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { traderId, amount } = req.body;
    const numericAmount = Number(amount);

    if (!traderId || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, detail: "Trader ID and valid amount required" });
    }

    const traderResult = await query("SELECT id FROM traders WHERE id = $1 AND is_active = TRUE", [traderId]);
    if (traderResult.rows.length === 0) {
      return res.status(404).json({ success: false, detail: "Trader not found" });
    }

    if (numericAmount > parseNumber(req.user.balance)) {
      return res.status(400).json({ success: false, detail: "Insufficient balance" });
    }

    const copyTradeId = uuidv4();
    const now = new Date();
    await query(
      `INSERT INTO copy_trades (id, user_id, trader_id, amount, current_profit, status, started_at, created_at)
       VALUES ($1, $2, $3, $4, 0, 'active', $5, $5)`,
      [copyTradeId, req.user.id, traderId, numericAmount, now]
    );

    res.status(201).json({
      success: true,
      message: "Copy trade started successfully",
      copyTrade: {
        copy_trade_id: copyTradeId,
        user_id: req.user.id,
        trader_id: traderId,
        amount: numericAmount,
        current_profit: 0,
        status: "active",
        started_at: now,
        created_at: now,
      },
    });
  })
);

app.get(
  "/api/copy/active",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT c.*, t.name, t.image, t.profit, t.risk, t.win_rate
       FROM copy_trades c
       LEFT JOIN traders t ON t.id = c.trader_id
       WHERE c.user_id = $1 AND c.status = 'active'`,
      [req.user.id]
    );

    const activeCopies = result.rows.map((row) => ({
      copy_trade_id: row.id,
      user_id: row.user_id,
      trader_id: row.trader_id,
      amount: parseNumber(row.amount),
      current_profit: parseNumber(row.current_profit),
      status: row.status,
      started_at: row.started_at,
      created_at: row.created_at,
      trader: row.trader_id
        ? {
            trader_id: row.trader_id,
            name: row.name,
            image: row.image,
            profit: row.profit,
            risk: row.risk,
            win_rate: row.win_rate,
          }
        : null,
    }));

    res.status(200).json({ success: true, activeCopies });
  })
);

app.delete(
  "/api/copy/:copyTradeId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { copyTradeId } = req.params;
    const result = await query("SELECT * FROM copy_trades WHERE id = $1", [copyTradeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, detail: "Copy trade not found" });
    }
    const copyTrade = result.rows[0];
    if (copyTrade.user_id !== req.user.id) {
      return res.status(403).json({ success: false, detail: "You can only stop your own copy trades" });
    }

    await query(
      "UPDATE copy_trades SET status = 'stopped', ended_at = NOW() WHERE id = $1",
      [copyTradeId]
    );
    res.status(200).json({ success: true, message: "Copy trade stopped successfully" });
  })
);

app.get(
  "/api/dashboard/stats",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const activeCopiesResult = await query(
      "SELECT COUNT(*)::int AS count, COALESCE(SUM(current_profit),0) AS profit FROM copy_trades WHERE user_id = $1 AND status = 'active'",
      [req.user.id]
    );
    const tradesResult = await query(
      "SELECT COUNT(*)::int AS count FROM transactions WHERE user_id = $1 AND type = 'trade'",
      [req.user.id]
    );
    const activeCopies = activeCopiesResult.rows[0];
    const totalProfit = parseNumber(activeCopies.profit);
    const balance = parseNumber(req.user.balance);
    const profitPercentage = balance > 0 ? (totalProfit / balance) * 100 : 0;

    res.status(200).json({
      success: true,
      portfolio: {
        balance,
        profit: totalProfit,
        profit_percentage: Math.round(profitPercentage * 100) / 100,
        active_copies: activeCopies.count,
        total_trades: tradesResult.rows[0]?.count || 0,
        profitPercentage: Math.round(profitPercentage * 100) / 100,
        activeCopies: activeCopies.count,
        totalTrades: tradesResult.rows[0]?.count || 0,
      },
    });
  })
);

app.get(
  "/api/plans",
  asyncHandler(async (_req, res) => {
    const result = await query("SELECT * FROM plans WHERE is_active = TRUE ORDER BY price ASC");
    const plans = result.rows.map((row) => ({
      plan_id: row.id,
      name: row.name,
      price: parseNumber(row.price),
      duration: row.duration,
      features: row.features || [],
      popular: row.popular,
    }));
    res.status(200).json({ success: true, plans });
  })
);

app.get(
  "/api/wallets",
  asyncHandler(async (_req, res) => {
    const wallets = await getAllWallets({ query });
    res.status(200).json({ success: true, wallets });
  })
);

app.get(
  "/api/wallets/:method",
  asyncHandler(async (req, res) => {
    const method = req.params.method.toLowerCase();
    const wallet = await getWalletByMethod({ query }, method);
    if (!wallet) {
      return res.status(404).json({ success: false, detail: "Payment method not found" });
    }
    res.status(200).json({ success: true, method, wallet });
  })
);

app.get(
  "/api/transactions/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC", [
      req.user.id,
    ]);
    const transactions = result.rows.map((row) => mapTransaction(row));
    res.status(200).json({ success: true, transactions });
  })
);

app.post(
  "/api/transactions",
  authMiddleware,
  asyncHandler(async (req, res) => {
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
      return res.status(400).json({ success: false, detail: `Minimum deposit is ${MIN_DEPOSIT}` });
    }

    if (type === "deposit" && numericAmount > MAX_DEPOSIT) {
      return res.status(400).json({ success: false, detail: `Maximum deposit is ${MAX_DEPOSIT}` });
    }

    if (type === "withdrawal" && numericAmount < MIN_WITHDRAWAL) {
      return res.status(400).json({ success: false, detail: `Minimum withdrawal is ${MIN_WITHDRAWAL}` });
    }

    if (type === "withdrawal" && numericAmount > MAX_WITHDRAWAL) {
      return res.status(400).json({ success: false, detail: `Maximum withdrawal is ${MAX_WITHDRAWAL}` });
    }

    if (type === "withdrawal") {
      if (!details || !details.address) {
        return res.status(400).json({ success: false, detail: "Withdrawal address is required" });
      }
      if (numericAmount > parseNumber(req.user.balance)) {
        return res.status(400).json({ success: false, detail: "Insufficient balance" });
      }
    }

    const transactionId = uuidv4();
    const now = new Date();
    await query(
      `INSERT INTO transactions (id, user_id, type, amount, method, asset, details, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, 'pending', $8)`,
      [
        transactionId,
        req.user.id,
        type,
        numericAmount,
        method || null,
        asset || null,
        details ? JSON.stringify(details) : null,
        now,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Transaction submitted",
      transaction: {
        transaction_id: transactionId,
        user_id: req.user.id,
        type,
        amount: numericAmount,
        method: method || null,
        asset: asset || null,
        details: details || null,
        status: "pending",
        date: now,
        created_at: now,
      },
    });
  })
);

app.put(
  "/api/profile",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { full_name, phone, country, picture } = req.body || {};

    if (!full_name && !phone && !country && !picture) {
      return res.status(400).json({ success: false, detail: "No profile updates provided" });
    }

    await query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           country = COALESCE($3, country),
           picture = COALESCE($4, picture),
           updated_at = NOW()
       WHERE id = $5`,
      [full_name ?? null, phone ?? null, country ?? null, picture ?? null, req.user.id]
    );

    const updated = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: mapUser(updated.rows[0]),
    });
  })
);


app.put(
  "/api/wallets/:method",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const method = req.params.method.toLowerCase();
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, detail: "Address required" });
    }

    await query(
      `INSERT INTO wallet_addresses (method, address, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (method) DO UPDATE SET address = $2::jsonb, updated_at = NOW()`,
      [method, JSON.stringify(address)]
    );

    res.status(200).json({ success: true, message: "Wallet address updated" });
  })
);

app.post(
  "/api/admin/users/:userId/suspend",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await query("UPDATE users SET status = 'inactive', updated_at = NOW() WHERE id = $1", [userId]);
    res.status(200).json({ success: true, message: "User account suspended" });
  })
);

app.post(
  "/api/admin/users/:userId/activate",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await query("UPDATE users SET status = 'active', updated_at = NOW() WHERE id = $1", [userId]);
    res.status(200).json({ success: true, message: "User account activated" });
  })
);

app.get(
  "/api/admin/users/:userId/balance",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await query("SELECT id, email, full_name, balance FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, detail: "User not found" });
    }
    const user = result.rows[0];
    res.status(200).json({
      success: true,
      user_id: user.id,
      balance: parseNumber(user.balance),
      email: user.email,
      full_name: user.full_name,
    });
  })
);

app.put(
  "/api/admin/users/:userId/balance",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { balance } = req.body;

    if (balance === undefined) {
      return res.status(400).json({ success: false, detail: "Balance amount required" });
    }

    await query("UPDATE users SET balance = $1, updated_at = NOW() WHERE id = $2", [
      balance,
      userId,
    ]);
    res.status(200).json({ success: true, message: "Balance updated successfully" });
  })
);

app.get(
  "/api/transactions",
  adminMiddleware,
  asyncHandler(async (_req, res) => {
    const result = await query("SELECT * FROM transactions ORDER BY created_at DESC");
    const transactions = result.rows.map((row) => mapTransaction(row));
    res.status(200).json({ success: true, transactions });
  })
);

app.put(
  "/api/transactions/:transactionId/approve",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    const txResult = await query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
    if (txResult.rows.length === 0) {
      return res.status(404).json({ success: false, detail: "Transaction not found" });
    }

    const tx = txResult.rows[0];
    if (tx.status !== "pending") {
      return res.status(400).json({ success: false, detail: "Transaction already processed" });
    }

    const amount = parseNumber(tx.amount);
    const userResult = await query("SELECT * FROM users WHERE id = $1", [tx.user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, detail: "User not found" });
    }
    const user = userResult.rows[0];
    let newBalance = parseNumber(user.balance);

    if (tx.type === "deposit") {
      newBalance += amount;
    } else if (tx.type === "withdrawal") {
      newBalance -= amount;
      if (newBalance < 0) {
        return res.status(400).json({ success: false, detail: "Insufficient balance" });
      }
    }

    await query("UPDATE users SET balance = $1, updated_at = NOW() WHERE id = $2", [
      newBalance,
      user.id,
    ]);

    await query(
      "UPDATE transactions SET status = 'completed', processed_by = $1, processed_at = NOW() WHERE id = $2",
      [req.user.id, transactionId]
    );

    res.status(200).json({ success: true, message: "Transaction approved" });
  })
);

app.put(
  "/api/transactions/:transactionId/reject",
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    const txResult = await query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
    if (txResult.rows.length === 0) {
      return res.status(404).json({ success: false, detail: "Transaction not found" });
    }

    const tx = txResult.rows[0];
    if (tx.status !== "pending") {
      return res.status(400).json({ success: false, detail: "Transaction already processed" });
    }

    await query(
      "UPDATE transactions SET status = 'rejected', processed_by = $1, processed_at = NOW() WHERE id = $2",
      [req.user.id, transactionId]
    );

    res.status(200).json({ success: true, message: "Transaction rejected" });
  })
);

app.get(
  "/api/admin/stats",
  adminMiddleware,
  asyncHandler(async (_req, res) => {
    const totalUsersResult = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'user'");
    const activeUsersResult = await query(
      "SELECT COUNT(*)::int AS count FROM users WHERE role = 'user' AND status = 'active'"
    );
    const totalTradersResult = await query("SELECT COUNT(*)::int AS count FROM traders WHERE is_active = TRUE");
    const totalTransactionsResult = await query("SELECT COUNT(*)::int AS count FROM transactions");
    const pendingTransactionsResult = await query(
      "SELECT COUNT(*)::int AS count FROM transactions WHERE status = 'pending'"
    );
    const totalPlansResult = await query("SELECT COUNT(*)::int AS count FROM plans WHERE is_active = TRUE");
    const totalRevenueResult = await query(
      "SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE type = 'deposit' AND status = 'completed'"
    );
    const pendingWithdrawalsResult = await query(
      "SELECT COUNT(*)::int AS count FROM transactions WHERE type = 'withdrawal' AND status = 'pending'"
    );
    const totalPlatformBalanceResult = await query("SELECT COALESCE(SUM(balance),0) AS total FROM users");

    res.status(200).json({
      success: true,
      stats: {
        total_users: totalUsersResult.rows[0].count,
        total_traders: totalTradersResult.rows[0].count,
        total_transactions: totalTransactionsResult.rows[0].count,
        pending_transactions: pendingTransactionsResult.rows[0].count,
        total_plans: totalPlansResult.rows[0].count,
        total_platform_balance: parseNumber(totalPlatformBalanceResult.rows[0].total),
        totalUsers: totalUsersResult.rows[0].count,
        activeUsers: activeUsersResult.rows[0].count,
        totalRevenue: parseNumber(totalRevenueResult.rows[0].total),
        pendingWithdrawals: pendingWithdrawalsResult.rows[0].count,
      },
    });
  })
);

app.get(
  "/api/health",
  asyncHandler(async (_req, res) => {
    try {
      await query("SELECT 1");
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

app.get(
  "/health",
  asyncHandler(async (_req, res) => {
    try {
      await query("SELECT 1");
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
