# ========================================
# EXTERNAL HOSTING CONFIGURATION GUIDE
# Monacap Trading Pro - Environment Variables
# ========================================

# ==========================================
# SCENARIO 1: Frontend Hosted Externally + Backend on Emergent
# ==========================================

# --- FRONTEND .env (External Hosting - Vercel, Netlify, etc.) ---
# Create a .env file in your frontend directory with:

REACT_APP_BACKEND_URL=https://monacaptrade.preview.emergentagent.com

# That's it! The frontend only needs to know where the backend is.
# Replace with your actual Emergent backend URL


# --- BACKEND .env (Stays on Emergent) ---
# The backend needs these variables configured on Emergent:

MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
JWT_SECRET=your_secret_key_change_in_production_monacap_trading_pro_2025

# Email Configuration
SMTP_HOST=mail.monacaptradingpro.com
SMTP_PORT=587
SMTP_USERNAME=support@monacaptradingpro.com
SMTP_PASSWORD=Arinze23.
SMTP_FROM_EMAIL=support@monacaptradingpro.com
SMTP_FROM_NAME=Monacap Trading Pro Support

# Application URL (Your external frontend URL)
APP_URL=https://yourdomain.com

# CORS Configuration (Add your external domain)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,http://localhost:3000


# ==========================================
# SCENARIO 2: Both Frontend + Backend Hosted Externally
# ==========================================

# --- FRONTEND .env (External Hosting) ---
REACT_APP_BACKEND_URL=https://api.yourdomain.com

# --- BACKEND .env (External Server - VPS, Cloud, etc.) ---
MONGO_URL=mongodb://your-mongodb-server:27017
DB_NAME=monacaptradingpro
JWT_SECRET=generate_a_very_strong_random_secret_key_here

# Email Configuration
SMTP_HOST=mail.monacaptradingpro.com
SMTP_PORT=587
SMTP_USERNAME=support@monacaptradingpro.com
SMTP_PASSWORD=Arinze23.
SMTP_FROM_EMAIL=support@monacaptradingpro.com
SMTP_FROM_NAME=Monacap Trading Pro Support

# Application URL (Your frontend URL)
APP_URL=https://yourdomain.com

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Server Port (if needed)
PORT=8001


# ==========================================
# DEPLOYMENT PLATFORMS SPECIFIC VARIABLES
# ==========================================

# --- VERCEL (Frontend) ---
# In Vercel Dashboard → Settings → Environment Variables, add:
# Key: REACT_APP_BACKEND_URL
# Value: https://monacaptrade.preview.emergentagent.com

# --- NETLIFY (Frontend) ---
# In Netlify Dashboard → Site Settings → Build & Deploy → Environment, add:
# Key: REACT_APP_BACKEND_URL
# Value: https://monacaptrade.preview.emergentagent.com

# --- HEROKU (Backend) ---
# heroku config:set MONGO_URL=your_mongodb_url
# heroku config:set JWT_SECRET=your_secret
# heroku config:set SMTP_HOST=mail.monacaptradingpro.com
# etc...

# --- RAILWAY (Backend) ---
# In Railway Dashboard → Variables, add all backend env vars

# --- DIGITAL OCEAN APP PLATFORM (Backend) ---
# In App Settings → Environment Variables, add all backend env vars


# ==========================================
# IMPORTANT SECURITY NOTES
# ==========================================

# 1. NEVER commit .env files to Git
#    Add .env to .gitignore

# 2. Generate strong JWT_SECRET:
#    Use: openssl rand -hex 32

# 3. Use HTTPS only in production
#    HTTP URLs are only for local development

# 4. Update CORS_ORIGINS for each deployment
#    Add your actual domain, remove localhost in production

# 5. MongoDB Connection:
#    If hosting externally, use MongoDB Atlas or managed DB
#    Connection string format:
#    mongodb+srv://username:password@cluster.mongodb.net/dbname

# 6. Protect SMTP credentials:
#    Consider using environment-specific credentials
#    Use app-specific passwords if available


# ==========================================
# EMERGENT GOOGLE OAUTH CONFIGURATION
# ==========================================

# The Emergent Google OAuth will work automatically as long as:
# 1. Your frontend redirects to: https://auth.emergentagent.com/
# 2. Your backend has the session exchange endpoint: /api/auth/google
# 3. CORS allows requests from your domain

# No additional OAuth configuration needed!


# ==========================================
# TESTING YOUR CONFIGURATION
# ==========================================

# Test Backend API:
# curl https://your-backend-url/api/traders

# Test Frontend:
# Visit https://yourdomain.com
# Check browser console for any CORS errors

# Test Email:
# Register a new user and check if welcome email arrives


# ==========================================
# TROUBLESHOOTING
# ==========================================

# CORS Errors:
# - Make sure your domain is in CORS_ORIGINS on backend
# - Restart backend after changing CORS settings

# Email Not Sending:
# - Verify SMTP credentials
# - Check SMTP_HOST is correct
# - Try port 465 (SSL) if 587 fails

# Authentication Issues:
# - Clear browser localStorage
# - Check if JWT_SECRET is set
# - Verify backend API is accessible

# Database Connection Failed:
# - Check MongoDB is running
# - Verify MONGO_URL format
# - Ensure network connectivity


# ==========================================
# RECOMMENDED EXTERNAL HOSTING SETUP
# ==========================================

# Frontend: Vercel or Netlify (Free tier available)
# - Auto-deploys from Git
# - CDN included
# - SSL certificates automatic

# Backend: Keep on Emergent (Current setup)
# - Already configured
# - MongoDB included
# - No additional setup needed

# Database: MongoDB Atlas (If moving backend externally)
# - Free tier: 512MB storage
# - Automatic backups
# - Connection string provided

# Email: Current setup (mail.monacaptradingpro.com)
# - Already configured
# - No changes needed
