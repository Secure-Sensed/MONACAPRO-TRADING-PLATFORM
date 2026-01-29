const jwt = require("jsonwebtoken");
const { query } = require("../services/db");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

const getAuthToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
};

const authMiddleware = async (req, res, next) => {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, detail: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userResult = await query("SELECT * FROM users WHERE id = $1", [payload.sub]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, detail: "Invalid token" });
    }
    req.user = userResult.rows[0];
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, detail: "Invalid or expired token" });
  }
};

const adminMiddleware = async (req, res, next) => {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, detail: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userResult = await query("SELECT * FROM users WHERE id = $1", [payload.sub]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, detail: "Invalid token" });
    }
    const user = userResult.rows[0];
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, detail: "Admin access required" });
    }
    req.user = user;
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, detail: "Invalid or expired token" });
  }
};

module.exports = {
  getAuthToken,
  authMiddleware,
  adminMiddleware,
};
