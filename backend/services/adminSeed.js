const ensureAdminUser = async (admin, db) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin User";

  if (!adminEmail || !adminPassword) {
    console.warn("Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD is missing.");
    return null;
  }

  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(adminEmail);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      userRecord = await admin.auth().createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: adminName,
        emailVerified: true,
      });
    } else {
      throw error;
    }
  }

  if (adminName && userRecord.displayName !== adminName) {
    await admin.auth().updateUser(userRecord.uid, { displayName: adminName });
    userRecord = await admin.auth().getUser(userRecord.uid);
  }

  const userRef = db.collection("users").doc(userRecord.uid);
  const existing = await userRef.get();
  const now = new Date();
  const existingData = existing.exists ? existing.data() : {};

  const adminDoc = {
    user_id: userRecord.uid,
    firebase_uid: userRecord.uid,
    email: adminEmail,
    full_name: adminName,
    picture: userRecord.photoURL || null,
    role: "admin",
    status: "active",
    balance: existingData?.balance ?? 0,
    created_at: existingData?.created_at || now,
    updated_at: now,
  };

  await userRef.set(adminDoc, { merge: true });
  return adminDoc;
};

module.exports = {
  ensureAdminUser,
};
