const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Backend will fail without a database.");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL && DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : undefined,
});

const query = (text, params) => pool.query(text, params);

const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      status TEXT NOT NULL DEFAULT 'active',
      balance NUMERIC(14,2) NOT NULL DEFAULT 0,
      phone TEXT,
      country TEXT,
      picture TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS traders (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      profit TEXT,
      risk TEXT,
      win_rate TEXT,
      followers INTEGER NOT NULL DEFAULT 0,
      trades INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS plans (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(14,2) NOT NULL,
      duration TEXT NOT NULL,
      features JSONB NOT NULL DEFAULT '[]'::jsonb,
      popular BOOLEAN NOT NULL DEFAULT FALSE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS copy_trades (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      trader_id UUID REFERENCES traders(id) ON DELETE SET NULL,
      amount NUMERIC(14,2) NOT NULL,
      current_profit NUMERIC(14,2) NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      started_at TIMESTAMP NOT NULL DEFAULT NOW(),
      ended_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount NUMERIC(14,2) NOT NULL,
      method TEXT,
      asset TEXT,
      details JSONB,
      status TEXT NOT NULL DEFAULT 'pending',
      processed_by UUID REFERENCES users(id),
      processed_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wallet_addresses (
      method TEXT PRIMARY KEY,
      address JSONB NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
};

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin User";

  if (!adminEmail || !adminPassword) {
    console.warn("Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD missing.");
    return;
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [adminEmail]);
  if (existing.rows.length > 0) {
    await query(
      "UPDATE users SET full_name = $1, role = 'admin', status = 'active', updated_at = NOW() WHERE email = $2",
      [adminName, adminEmail]
    );
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, status, balance)
     VALUES ($1, $2, $3, $4, 'admin', 'active', 0)`,
    [uuidv4(), adminEmail, passwordHash, adminName]
  );
};

const seedTraders = async () => {
  const existing = await query("SELECT id FROM traders LIMIT 1");
  if (existing.rows.length > 0) return;

  const traders = [
    {
      name: "John Martinez",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      profit: "+58.24%",
      risk: "Medium",
      win_rate: "76.71%",
    },
    {
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      profit: "+92.15%",
      risk: "High",
      win_rate: "82.34%",
    },
    {
      name: "Michael Johnson",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      profit: "+45.67%",
      risk: "Low",
      win_rate: "71.23%",
    },
  ];

  for (const trader of traders) {
    await query(
      `INSERT INTO traders (id, name, image, profit, risk, win_rate)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), trader.name, trader.image, trader.profit, trader.risk, trader.win_rate]
    );
  }
};

const seedPlans = async () => {
  const existing = await query("SELECT id FROM plans LIMIT 1");
  if (existing.rows.length > 0) return;

  const plans = [
    {
      name: "Starter",
      price: 500,
      duration: "30 days",
      features: ["Copy up to 2 traders", "Basic risk management", "Email support", "Market analysis reports"],
      popular: false,
    },
    {
      name: "Professional",
      price: 2000,
      duration: "30 days",
      features: [
        "Copy up to 5 traders",
        "Advanced risk management",
        "Priority support",
        "Daily market analysis",
        "Trading signals",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: 5000,
      duration: "30 days",
      features: [
        "Copy unlimited traders",
        "Custom risk management",
        "24/7 VIP support",
        "Personal account manager",
        "Premium trading signals",
        "Exclusive webinars",
      ],
      popular: false,
    },
  ];

  for (const plan of plans) {
    await query(
      `INSERT INTO plans (id, name, price, duration, features, popular)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
      [uuidv4(), plan.name, plan.price, plan.duration, JSON.stringify(plan.features), plan.popular]
    );
  }
};

const initDb = async () => {
  await ensureTables();
  await seedAdmin();
  await seedTraders();
  await seedPlans();
};

module.exports = {
  pool,
  query,
  initDb,
};
