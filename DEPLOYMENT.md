# MonaCap Pro Trading Platform

A full-stack trading platform built with React, Express, and Firebase.

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── package.json       # Root monorepo configuration
└── vercel.json        # Vercel deployment configuration
```

## Local Development

### Prerequisites
- Node.js 20.x or higher
- npm 8.x or higher

### Setup

1. **Install all dependencies:**
```bash
npm run install-all
```

2. **Configure environment variables:**

**Frontend (.env.local):**
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=vct-trading.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=vct-trading
REACT_APP_FIREBASE_STORAGE_BUCKET=vct-trading.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Backend (.env):**
```
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
PORT=8001
JWT_SECRET=your_jwt_secret
APP_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_password
```

### Running Locally

**Development mode (both frontend and backend):**
```bash
npm run dev
```

**Frontend only:**
```bash
npm run frontend
```

**Backend only:**
```bash
npm run backend
```

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository

### Environment Variables Setup

Set these in Vercel Project Settings → Environment Variables:

**Frontend Variables:**
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_BACKEND_URL` (set to your Vercel deployment URL)

**Backend Variables:**
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `JWT_SECRET`
- `APP_URL` (your Vercel deployment URL)
- `CORS_ORIGINS` (your Vercel deployment URL)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

### Deploy Steps

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically detect the `vercel.json` configuration
4. Set all required environment variables
5. Click Deploy

The application will be built and deployed with:
- Frontend served from the root path
- Backend API available at `/api/*` routes

## Architecture

### Frontend
- **Framework:** React 18
- **UI Components:** Radix UI
- **Authentication:** Firebase Auth
- **State Management:** Context API
- **HTTP Client:** Axios

### Backend
- **Framework:** Express.js
- **Database:** Firebase Firestore
- **Authentication:** Firebase Admin SDK
- **Email Service:** Nodemailer
- **CORS:** Enabled for frontend

## Key Features

- User authentication with Firebase
- Real-time data synchronization
- Copy trading functionality
- Dashboard with trading statistics
- Admin management panel
- Email notifications
- Responsive design

## API Routes

- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/traders` - Get all traders
- `GET /api/dashboard/stats` - Get dashboard statistics

See `contracts.md` for complete API documentation.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Push to GitHub
5. Create a Pull Request

## License

Proprietary - MonaCap Trading Pro
