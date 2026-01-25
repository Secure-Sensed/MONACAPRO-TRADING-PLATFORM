const admin = require("firebase-admin");
const db = admin.firestore();

const getAuthToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const authMiddleware = async (req, res, next) => {
  const authToken = getAuthToken(req);
  if (!authToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.error("Error verifying auth token:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

const adminMiddleware = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().role === 'admin') {
            return next();
        }
        return res.status(403).json({ success: false, message: "Forbidden" });
    } catch (error) {
        console.error("Error verifying admin role:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { authMiddleware, adminMiddleware };
