# API Contracts & Backend Implementation Plan

## 1. API Contracts

### Authentication Endpoints

#### POST /api/auth/register
**Request:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/login
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "user|admin"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/google
**Request:**
```json
{
  "credential": "google_credential_token"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Google authentication successful",
  "user": {...},
  "token": "jwt_token"
}
```

#### GET /api/auth/me
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "string",
    "balance": "number",
    "createdAt": "date"
  }
}
```

### User Management Endpoints

#### GET /api/users
**Headers:** Authorization: Bearer {admin_token}
**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "balance": "number",
      "status": "active|inactive",
      "createdAt": "date"
    }
  ]
}
```

#### PUT /api/users/:id
**Headers:** Authorization: Bearer {admin_token}
**Request:**
```json
{
  "status": "active|inactive",
  "balance": "number"
}
```

#### DELETE /api/users/:id
**Headers:** Authorization: Bearer {admin_token}

### Lead Traders Endpoints

#### GET /api/traders
**Response:**
```json
{
  "success": true,
  "traders": [
    {
      "id": "string",
      "name": "string",
      "image": "string",
      "profit": "string",
      "followers": "number",
      "risk": "Low|Medium|High",
      "trades": "number",
      "winRate": "string"
    }
  ]
}
```

#### POST /api/traders
**Headers:** Authorization: Bearer {admin_token}
**Request:**
```json
{
  "name": "string",
  "image": "string",
  "profit": "string",
  "risk": "string",
  "winRate": "string"
}
```

#### PUT /api/traders/:id
**Headers:** Authorization: Bearer {admin_token}

#### DELETE /api/traders/:id
**Headers:** Authorization: Bearer {admin_token}

### Copy Trading Endpoints

#### POST /api/copy/start
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
  "traderId": "string",
  "amount": "number"
}
```

#### GET /api/copy/active
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
  "success": true,
  "activeCopies": [
    {
      "id": "string",
      "trader": {...},
      "amount": "number",
      "startedAt": "date",
      "currentProfit": "number"
    }
  ]
}
```

#### DELETE /api/copy/:id
**Headers:** Authorization: Bearer {token}

### Transaction Endpoints

#### POST /api/transactions/deposit
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
  "amount": "number",
  "method": "Bank Transfer|Credit Card|Crypto"
}
```

#### POST /api/transactions/withdraw
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
  "amount": "number",
  "method": "Bank Transfer|Credit Card"
}
```

#### GET /api/transactions
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "string",
      "type": "deposit|withdrawal|trade",
      "amount": "number",
      "status": "pending|completed|rejected",
      "method": "string",
      "date": "date"
    }
  ]
}
```

#### PUT /api/transactions/:id/approve
**Headers:** Authorization: Bearer {admin_token}

#### PUT /api/transactions/:id/reject
**Headers:** Authorization: Bearer {admin_token}

### Trading Plans Endpoints

#### GET /api/plans
**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "duration": "string",
      "features": ["string"],
      "popular": "boolean"
    }
  ]
}
```

#### POST /api/plans
**Headers:** Authorization: Bearer {admin_token}

#### PUT /api/plans/:id
**Headers:** Authorization: Bearer {admin_token}

#### DELETE /api/plans/:id
**Headers:** Authorization: Bearer {admin_token}

### Dashboard Endpoints

#### GET /api/dashboard/stats
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
  "success": true,
  "portfolio": {
    "balance": "number",
    "profit": "number",
    "profitPercentage": "number",
    "activeCopies": "number",
    "totalTrades": "number"
  }
}
```

## 2. Mocked Data to Replace

### From mockData.js:
- `tradingStats` - Will be calculated from database
- `features` - Static, can remain in frontend
- `tradingAssets` - Static, can remain in frontend
- `leadTraders` - Replace with MongoDB collection
- `tradingPlans` - Replace with MongoDB collection
- `recentTransactions` - Replace with MongoDB collection
- `achievements` - Static, can remain in frontend

### From localStorage:
- `isLoggedIn` - Replace with JWT token validation
- `isAdmin` - Replace with JWT role checking

## 3. MongoDB Models

### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  googleId: String (optional),
  role: String (enum: 'user', 'admin'),
  balance: Number (default: 0),
  status: String (enum: 'active', 'inactive'),
  createdAt: Date,
  updatedAt: Date
}
```

### Trader Model
```javascript
{
  name: String,
  image: String,
  profit: String,
  followers: Number,
  risk: String (enum: 'Low', 'Medium', 'High'),
  trades: Number,
  winRate: String,
  isActive: Boolean,
  createdAt: Date
}
```

### CopyTrade Model
```javascript
{
  userId: ObjectId (ref: User),
  traderId: ObjectId (ref: Trader),
  amount: Number,
  startedAt: Date,
  endedAt: Date (optional),
  currentProfit: Number,
  status: String (enum: 'active', 'stopped')
}
```

### Transaction Model
```javascript
{
  userId: ObjectId (ref: User),
  type: String (enum: 'deposit', 'withdrawal', 'trade'),
  amount: Number,
  method: String,
  status: String (enum: 'pending', 'completed', 'rejected'),
  asset: String (optional),
  date: Date,
  processedBy: ObjectId (ref: User) (optional, for admin)
}
```

### Plan Model
```javascript
{
  name: String,
  price: Number,
  duration: String,
  features: [String],
  popular: Boolean,
  isActive: Boolean,
  createdAt: Date
}
```

## 4. Frontend-Backend Integration Points

### Authentication Flow:
1. Frontend: User submits login/register form
2. Backend: Validate credentials, generate JWT token
3. Frontend: Store token in localStorage, update auth context
4. Frontend: Include token in Authorization header for all requests

### Google OAuth Flow:
1. Frontend: User clicks "Continue with Google"
2. Frontend: Opens Emergent Google OAuth popup
3. Backend: Receives credential, validates with Google, creates/updates user
4. Frontend: Receives JWT token, stores and redirects to dashboard

### Dashboard Data Flow:
1. Frontend: Load dashboard page with useEffect
2. Frontend: Call /api/dashboard/stats with JWT token
3. Backend: Validate token, fetch user data from MongoDB
4. Frontend: Display data with real-time updates

### Admin Panel Flow:
1. Frontend: Admin logs in with admin credentials
2. Backend: Validate, return JWT with role='admin'
3. Frontend: Check role, show admin panel
4. Frontend: CRUD operations call respective admin endpoints

### Real-time Crypto Prices:
- Keep using CoinGecko API on frontend (no backend change needed)
- Prices remain client-side for better performance

## 5. Environment Variables Needed

### Backend (.env):
```
MONGO_URL=mongodb://localhost:27017/moncaplus
DB_NAME=moncaplus
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=8001
```

## 6. Implementation Order

1. ✅ Setup MongoDB models
2. ✅ Implement authentication (JWT + bcrypt)
3. ✅ Implement Emergent Google Auth
4. ✅ Implement user management endpoints
5. ✅ Implement traders CRUD
6. ✅ Implement copy trading functionality
7. ✅ Implement transaction management
8. ✅ Implement plans management
9. ✅ Update frontend to use real APIs
10. ✅ Testing and validation
