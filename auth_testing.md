# Auth-Gated App Testing Playbook (Firebase Auth)

## Step 1: Ensure Firebase is configured
Set these backend env vars before testing:
```
FIREBASE_API_KEY=your_firebase_web_api_key
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

## Step 2: Register or Login (Firebase Auth)
```bash
# Register a user (returns Firebase ID token)
curl -X POST "http://localhost:8001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test.user@example.com","password":"testpassword123"}'

# Login (returns Firebase ID token)
curl -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test.user@example.com","password":"testpassword123"}'
```

## Step 3: Test Backend API (Bearer ID Token)
```bash
# Test auth endpoint
curl -X GET "http://localhost:8001/api/auth/me" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"

# Test traders endpoint
curl -X GET "http://localhost:8001/api/traders"

# Test dashboard stats
curl -X GET "http://localhost:8001/api/dashboard/stats" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

## Step 4: Browser Testing
Login through the UI (Firebase Auth). The frontend stores the Firebase ID token in localStorage
and attaches it to API requests automatically.

## Quick Debug
```bash
# Check user data
mongosh --eval "
use('moncaplus');
db.users.find().limit(2).pretty();
"
```

## Checklist
- [ ] Firebase user exists for the email
- [ ] Mongo user has firebase_uid populated
- [ ] API returns user data with user_id field
- [ ] Browser loads dashboard (not login page)

## Success Indicators
✅ /api/auth/me returns user data
✅ Dashboard loads without redirect
✅ CRUD operations work

## Failure Indicators
❌ "Invalid or expired token" errors
❌ 401 Unauthorized responses
❌ Redirect to login page
