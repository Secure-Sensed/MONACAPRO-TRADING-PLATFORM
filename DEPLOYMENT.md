# MonaCap Pro Trading Platform

A full-stack trading platform built with React and Supabase (Auth + Postgres + RLS).
The Express backend remains in the repo but is no longer required when using Supabase.

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Legacy Express API (optional)
├── supabase/          # Supabase schema + seed SQL
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
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (.env) - legacy only if you still run Express:**
```
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=8001
APP_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
UPLOAD_DIR=/var/data/uploads
MIN_DEPOSIT=250
MIN_WITHDRAWAL=100
MAX_WITHDRAWAL=100000
MAX_DEPOSIT=1000000
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

**Backend only (legacy):**
```bash
cd backend
npm start
```

## Deployment

### Supabase (Recommended)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. (Optional) Run `supabase/seed.sql` to load starter traders/plans/wallets.
4. Set frontend env vars (see above) and deploy the frontend.

### Render (Legacy backend)

1. **Create a Render Postgres database** and copy the `DATABASE_URL`.
2. **Create a Render Web Service** for the backend:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
3. **Set environment variables** (see `.env.example`):
   - `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`
   - `CORS_ORIGINS`, `APP_URL`
   - `MIN_DEPOSIT`, `MIN_WITHDRAWAL`, `MAX_WITHDRAWAL`, `MAX_DEPOSIT`
   - SMTP settings (optional)

### Frontend Deployment to Vercel

1. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select "Other" for framework detection (it will auto-detect Next.js/React)

2. **Set Environment Variables:**
   - In Vercel Project Settings → Environment Variables, add:

   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
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
- **Authentication:** JWT (backend)
- **State Management:** Context API
- **HTTP Client:** Axios
- **Build Tool:** Create React App

### Backend
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **Email Service:** Nodemailer
- **Runtime:** Node.js 20.x

## Key Features

- User authentication with JWT
- Postgres-backed data storage
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
