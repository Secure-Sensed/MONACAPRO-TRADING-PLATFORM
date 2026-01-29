const DEFAULT_WALLETS = {
  bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ethereum: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
  usdt_trc20: "TXYZopYRdj2D9XRtbG4uTdwZjX9c2V4h9q",
  usdt_erc20: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
  bank_transfer: {
    bank_name: "Chase Bank",
    account_name: "Monacap Trading Pro LLC",
    account_number: "1234567890",
    routing_number: "021000021",
    swift_code: "CHASUS33",
  },
  paypal: "payments@monacaptradingpro.com",
};

const getWalletOverrides = async (db) => {
  const result = await db.query("SELECT method, address FROM wallet_addresses");
  const overrides = {};
  result.rows.forEach((row) => {
    overrides[row.method] = row.address;
  });
  return overrides;
};

const getAllWallets = async (db) => {
  const overrides = await getWalletOverrides(db);
  return { ...DEFAULT_WALLETS, ...overrides };
};

const getWalletByMethod = async (db, method) => {
  const overrides = await getWalletOverrides(db);
  if (overrides[method]) {
    return overrides[method];
  }
  return DEFAULT_WALLETS[method] || null;
};

module.exports = {
  DEFAULT_WALLETS,
  getAllWallets,
  getWalletByMethod,
};
