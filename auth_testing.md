# Auth-Gated App Testing Playbook (JWT + Postgres)

## Step 1: Ensure backend is configured
Set these backend env vars before testing:
```
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=change_me
```

## Step 2: Register or Login
```bash
# Register a user (returns JWT)
curl -X POST "http://localhost:8001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test.user@example.com","password":"testpassword123"}'

# Login (returns JWT)
curl -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test.user@example.com","password":"testpassword123"}'
```

## Step 3: Test Backend API (Bearer JWT)
```bash
# Test auth endpoint
curl -X GET "http://localhost:8001/api/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test traders endpoint
curl -X GET "http://localhost:8001/api/traders"

# Test dashboard stats
curl -X GET "http://localhost:8001/api/dashboard/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Step 4: Browser Testing
Login through the UI. The frontend stores the JWT in localStorage
and attaches it to API requests automatically.

## Quick Debug
```bash
# Check user data
psql "$DATABASE_URL" -c "SELECT id, email, role, status, balance FROM users LIMIT 5;"
```

## Checklist
- [ ] User exists in Postgres
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
