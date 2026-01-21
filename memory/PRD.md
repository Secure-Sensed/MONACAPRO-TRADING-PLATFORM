# Monacap Trading Pro - Product Requirements Document

## Original Problem Statement
Create a pixel-perfect clone of the trading website `https://moncapluscopytrading.com/` with:
- Full backend and admin panel
- Real-time prices
- Rebranded to "Monacap Trading Pro"
- User management features
- Email notifications
- Content pages

## User Requirements
1. Clone the original site's design, layout, colors, fonts, images, animations
2. Backend with admin panel for managing users, traders, transactions
3. Real-time trading prices
4. Two admin accounts: `admin` and `addmin` with password `admin0123`
5. High-end, dynamic animations
6. Copy Trader flow with wallet deposit modal
7. All branding changed to "Monacap Trading Pro"
8. Real-time trading chart on user dashboard
9. User password change functionality
10. Admin can manage user accounts (hold/activate) and view wallet balances
11. Welcome email on signup
12. Content pages for Stocks, Mirror Trading, Company, Partnership, Contact, Software, Insight

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, Framer Motion, Recharts
- **Backend**: FastAPI, Python, MongoDB (Motor for async)
- **Authentication**: JWT-based session management

## What's Been Implemented ✅

### Last Updated: January 21, 2025

#### Core Features
- [x] Full React frontend with multi-page structure
- [x] FastAPI backend with all API endpoints
- [x] MongoDB database integration
- [x] JWT-based authentication (login/register)
- [x] Admin and user roles with protected routes
- [x] Real-time trading chart on dashboard (Recharts)
- [x] High-end animations with Framer Motion
- [x] Responsive design with Tailwind CSS

#### Pages Completed
- [x] Home page with hero section and features
- [x] Login page (works for both users and admins)
- [x] Registration page
- [x] User Dashboard with real-time chart
- [x] Admin Dashboard with user management
- [x] Stocks page with searchable stock list
- [x] Mirror Trading page with copy trading info
- [x] Company page with about/story content
- [x] Partnership page with partner programs
- [x] Contact page with contact form
- [x] Software page with platform info
- [x] Insight page with articles and webinars

#### Backend Endpoints
- [x] POST /api/auth/register - User registration
- [x] POST /api/auth/login - User/Admin login
- [x] POST /api/auth/google - Google OAuth
- [x] GET /api/auth/me - Get current user
- [x] POST /api/auth/logout - Logout
- [x] POST /api/auth/change-password - Change password
- [x] GET /api/users - Get all users (admin)
- [x] PUT /api/users/{id} - Update user (admin)
- [x] DELETE /api/users/{id} - Delete user (admin)
- [x] GET /api/traders - Get all traders
- [x] POST /api/traders - Create trader (admin)
- [x] GET /api/dashboard/stats - User dashboard stats
- [x] GET /api/plans - Get trading plans
- [x] GET /api/wallets - Get wallet addresses
- [x] GET /api/transactions - Get transactions (admin)
- [x] PUT /api/transactions/{id}/approve - Approve transaction (admin)
- [x] PUT /api/transactions/{id}/reject - Reject transaction (admin)
- [x] GET /api/admin/stats - Admin statistics
- [x] POST /api/admin/users/{id}/suspend - Suspend user (admin)
- [x] POST /api/admin/users/{id}/activate - Activate user (admin)
- [x] GET /api/admin/users/{id}/balance - Get user balance (admin)
- [x] PUT /api/admin/users/{id}/balance - Update user balance (admin)

#### Deployment Configuration
- [x] vercel.json for SPA routing on Vercel
- [x] CORS configuration for production
- [x] Health check endpoint

## Credentials
- **Admin 1**: admin@monacaptradingpro.com / admin0123
- **Admin 2**: addmin@monacaptradingpro.com / admin0123

## Testing Status
- Backend: 18/18 tests passed (100%)
- Frontend: All pages verified working (100%)

## Remaining/Future Tasks

### P1 - High Priority
- [ ] Language translation feature (i18n)
- [ ] Chat support pop-up
- [ ] Remove web designer's name (needs location)

### P2 - Medium Priority
- [ ] Full design review against original site
- [ ] Additional achievements/certificates matching original
- [ ] Email template improvements

### P3 - Low Priority
- [ ] More stock data integration
- [ ] Real-time price API integration (currently mock)
- [ ] User profile image upload

## File Structure
```
/app
├── backend/
│   ├── server.py         # Main FastAPI app
│   ├── auth.py           # Authentication helpers
│   ├── models.py         # Pydantic models
│   ├── email_service.py  # Email functionality
│   ├── wallet_service.py # Wallet management
│   ├── seed.py           # Database seeding
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main app with routes
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── vercel.json       # Vercel deployment config
│   └── package.json      # Dependencies
└── test_reports/
    └── iteration_1.json  # Test results
```

## Environment Variables

### Frontend (.env)
- REACT_APP_BACKEND_URL - Backend API URL

### Backend (.env)
- MONGO_URL - MongoDB connection string
- DB_NAME - Database name
- JWT_SECRET - JWT signing secret
- SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD - Email config
- APP_URL - Frontend URL
- CORS_ORIGINS - Allowed origins
