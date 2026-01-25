# MonaCap Pro Trading Platform

A full-stack trading platform built with React, Express, and Firebase.

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Express backend API (separate deployment)
└── vercel.json        # Vercel deployment configuration
```

## Local Development

### Prerequisites
- Node.js 20.x or higher
- npm 8.x or higher

### Setup

1. **Install frontend dependencies:**
```bash
cd frontend
npm install --legacy-peer-deps
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Configure environment variables:**

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

**Frontend only:**
```bash
cd frontend
npm start
```

**Backend only:**
```bash
cd backend
npm start
```

## Deployment

### Frontend Deployment to Vercel

1. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select "Other" for framework detection (it will auto-detect Next.js/React)

2. **Set Environment Variables:**
   - In Vercel Project Settings → Environment Variables, add:
   
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=vct-trading.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=vct-trading
   REACT_APP_FIREBASE_STORAGE_BUCKET=vct-trading.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=66965555658
   REACT_APP_FIREBASE_APP_ID=1:66965555658:web:4b06dbb9e7d1e26fbce733
   REACT_APP_BACKEND_URL=https://your-backend-url.com
   ```

3. **Deploy:**
   - Click Deploy - Vercel will automatically build the frontend from the `frontend/` directory

### Backend Deployment

**Option 1: Deploy to Railway.app (Recommended)**

1. Sign up at https://railway.app
2. Create new project → Deploy from GitHub
3. Select this repository
4. Set environment variables in Railway dashboard:
   ```
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   PORT=8001
   JWT_SECRET=your_jwt_secret
   APP_URL=https://your-vercel-frontend-url.vercel.app
   CORS_ORIGINS=https://your-vercel-frontend-url.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email
   SMTP_PASSWORD=your_app_password
   SMTP_FROM_EMAIL=noreply@monacaptradingpro.com
   SMTP_FROM_NAME=Monacap Trading Pro
   ```
5. Deploy

**Option 2: Deploy to Heroku**

```bash
heroku create your-app-name
heroku buildpacks:add --index 1 https://github.com/timanovsky/subdir-heroku-buildpack
heroku config:set PROJECT_PATH=backend
git push heroku main
```

**Option 3: Docker Deployment (Self-hosted)**

Create `backend/Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8001
CMD ["npm", "start"]
```

Then deploy using Docker to your server.

## Architecture

### Frontend
- **Framework:** React 18
- **UI Components:** Radix UI
- **Authentication:** Firebase Auth
- **State Management:** Context API
- **HTTP Client:** Axios
- **Build Tool:** Create React App

### Backend
- **Framework:** Express.js
- **Database:** Firebase Firestore
- **Authentication:** Firebase Admin SDK
- **Email Service:** Nodemailer
- **Runtime:** Node.js 20.x

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
