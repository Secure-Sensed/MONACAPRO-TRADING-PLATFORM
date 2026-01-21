# Monacap Trading Pro - Product Requirements Document

## Original Problem Statement
Create a pixel-perfect clone of the trading website `https://moncapluscopytrading.com/` with:
- Full backend and admin panel
- Real-time prices
- Rebranded to "Monacap Trading Pro"
- User management features
- Email notifications
- Content pages

## What's Been Implemented ✅

### Last Updated: January 21, 2025

#### Core Features
- [x] Full React frontend with multi-page structure
- [x] FastAPI backend with all API endpoints
- [x] MongoDB database integration
- [x] JWT-based authentication (login/register)
- [x] Admin and user roles with protected routes
- [x] Real-time trading chart on dashboard (Recharts)
- [x] Real-time crypto prices from CoinGecko API (auto-refresh every 30s)
- [x] High-end animations with Framer Motion
- [x] Responsive design with Tailwind CSS
- [x] Language translation (i18n) - 4 languages (EN, ES, FR, AR)
- [x] Chat support widget with quick replies
- [x] vercel.json for SPA routing on Vercel

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

#### New Features Added (Jan 21, 2025)
- [x] i18n internationalization with 4 languages
- [x] LanguageSelector component in Navbar
- [x] ChatWidget component for live support
- [x] Auto-refresh crypto prices (30 second interval)
- [x] RTL support for Arabic

## Testing Status
- Backend: 18/18 tests passed (100%)
- Frontend: 95% (i18n setup works, translations need to be applied to page content)

## Credentials
- **Admin 1**: admin@monacaptradingpro.com / admin0123
- **Admin 2**: addmin@monacaptradingpro.com / admin0123

## Remaining Tasks

### P1 - High Priority
- [ ] Apply i18n translations to page content (Home, Stocks, etc.)
- [ ] Full pixel-perfect design review against original site

### P2 - Medium Priority  
- [ ] Real stock prices API integration (currently mock)
- [ ] Email template improvements

### P3 - Low Priority
- [ ] User profile image upload
- [ ] Additional languages

## File Structure
```
/app
├── backend/
│   ├── server.py, auth.py, models.py, etc.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget.jsx      # NEW
│   │   │   ├── LanguageSelector.jsx # NEW
│   │   │   └── ...
│   │   ├── i18n/                    # NEW
│   │   │   ├── index.js
│   │   │   └── locales/
│   │   │       ├── en.json, es.json, fr.json, ar.json
│   │   ├── pages/
│   │   └── App.js
│   ├── vercel.json
│   └── package.json
└── test_reports/
    ├── iteration_1.json
    └── iteration_2.json
```
