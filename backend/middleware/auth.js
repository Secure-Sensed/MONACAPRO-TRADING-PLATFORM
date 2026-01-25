const getAuthToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
};

const ensureUserProfile = async (db, admin, decodedToken) => {
  const uid = decodedToken.uid;
  const userRef = db.collection("users").doc(uid);
  const existingUser = await userRef.get();

  if (existingUser.exists) {
    const data = existingUser.data() || {};
    const merged = {
      user_id: data.user_id || uid,
      firebase_uid: data.firebase_uid || uid,
      ...data,
    };
    if (!data.user_id || !data.firebase_uid) {
      await userRef.set(
        {
          user_id: uid,
          firebase_uid: uid,
          updated_at: new Date(),
        },
        { merge: true }
      );
    }
    return { uid, ...merged };
  }

  let userRecord = null;
  try {
    userRecord = await admin.auth().getUser(uid);
  } catch (error) {
    userRecord = null;
  }

  const email = userRecord?.email || decodedToken.email;
  if (email) {
    const snapshot = await db.collection("users").where("email", "==", email).limit(1).get();
    if (!snapshot.empty) {
      const existingData = snapshot.docs[0].data();
      const merged = {
        ...existingData,
        firebase_uid: uid,
        user_id: existingData.user_id || uid,
        updated_at: new Date(),
      };
      await userRef.set(merged, { merge: true });
      return { uid, ...merged };
    }
  }

  const fullName =
    userRecord?.displayName ||
    decodedToken.name ||
    (email ? email.split("@")[0] : "Monacap User");
  const picture = userRecord?.photoURL || decodedToken.picture || null;

  const newUser = {
    firebase_uid: uid,
    user_id: uid,
    email,
    full_name: fullName,
    picture,
    role: "user",
    balance: 0.0,
    status: "active",
    created_at: new Date(),
  };

  await userRef.set(newUser);
  return { uid, ...newUser };
};

const authMiddleware = (db, admin) => async (req, res, next) => {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, detail: "Not authenticated" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await ensureUserProfile(db, admin, decodedToken);
    req.user = user;
    req.firebaseToken = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      detail: "Invalid or expired token",
    });
  }
};

const adminMiddleware = (db, admin) => async (req, res, next) => {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, detail: "Not authenticated" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await ensureUserProfile(db, admin, decodedToken);
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, detail: "Admin access required" });
    }
    req.user = user;
    req.firebaseToken = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      detail: "Invalid or expired token",
    });
  }
};

module.exports = {
  getAuthToken,
  ensureUserProfile,
  authMiddleware,
  adminMiddleware,
};
