# ========================================
# EXTERNAL FRONTEND + EMERGENT BACKEND
# Simple Deployment Guide
# ========================================

> Note: This guide references the legacy backend. The project now uses Supabase.
> Use `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` instead of `REACT_APP_BACKEND_URL`.
> See `supabase/README.md` for the current setup.

## 🎯 Setup Overview
- ✅ Frontend: Host on Vercel/Netlify/Your Server
- ✅ Backend: Stays on Emergent (No changes needed!)
- ✅ Database: MongoDB on Emergent
- ✅ Email: Your mail.monacaptradingpro.com

---

## 📋 STEP 1: Frontend Environment Variable

### Create `.env` file in your frontend directory:

```env
REACT_APP_BACKEND_URL=https://monacaptrade.preview.emergentagent.com
```

**That's it!** Just one variable needed for frontend.

---

## 🚀 STEP 2: Deploy Frontend

### Option A: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Go to frontend directory:
   ```bash
   cd /app/frontend
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variable in Vercel Dashboard:
   - Go to: Settings → Environment Variables
   - Add: `REACT_APP_BACKEND_URL` = `https://monacaptrade.preview.emergentagent.com`
   - Redeploy

### Option B: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd /app/frontend
   netlify deploy --prod
   ```

3. Add environment variable in Netlify Dashboard:
   - Go to: Site Settings → Build & Deploy → Environment
   - Add: `REACT_APP_BACKEND_URL` = `https://monacaptrade.preview.emergentagent.com`

### Option C: Your Own Server (VPS/Cloud)

1. Build frontend:
   ```bash
   cd /app/frontend
   yarn build
   ```

2. Upload `build/` folder to your server

3. Serve with Nginx:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/monacaptradingpro/build;
       index index.html;
       
       location / {
           try_files $uri /index.html;
       }
       
       # Add environment variable
       location /env-config.js {
           return 200 'window.ENV = { REACT_APP_BACKEND_URL: "https://monacaptrade.preview.emergentagent.com" };';
           add_header Content-Type application/javascript;
       }
   }
   ```

---

## 🔧 STEP 3: Update Backend CORS (On Emergent)

Update `/app/backend/.env` on Emergent to allow your frontend domain:

```env
CORS_ORIGINS=http://localhost:3000,https://monacaptrade.preview.emergentagent.com,https://yourdomain.com,https://www.yourdomain.com
```

**Replace `yourdomain.com` with your actual domain!**

Then restart backend:
```bash
sudo supervisorctl restart backend
```

---

## ✅ STEP 4: Verify Everything Works

### Test Backend API:
```bash
curl https://monacaptrade.preview.emergentagent.com/api/traders
```

Should return JSON with traders list.

### Test Frontend:
1. Visit your deployed frontend URL
2. Try to login with: user@test.com / password123
3. Check browser console - should see no CORS errors

### Test Email (Welcome Email on Signup):
1. Register a new user
2. Check email at the address you registered
3. Should receive welcome email from support@monacaptradingpro.com

---

## 📝 Current Backend Configuration (Already on Emergent)

Your backend on Emergent is already configured with:

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database

# Security
JWT_SECRET=your_secret_key_change_in_production_monacap_trading_pro_2025

# Email (Your Webmail)
SMTP_HOST=mail.monacaptradingpro.com
SMTP_PORT=587
SMTP_USERNAME=support@monacaptradingpro.com
SMTP_PASSWORD=Arinze23.
SMTP_FROM_EMAIL=support@monacaptradingpro.com
SMTP_FROM_NAME=Monacap Trading Pro Support

# Frontend URL (for email links)
APP_URL=https://yourdomain.com  # UPDATE THIS!

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com  # UPDATE THIS!
```

**Important:** Update `APP_URL` and `CORS_ORIGINS` with your actual frontend domain!

---

## 🔄 When You Get a Custom Domain

Example: You deploy to `www.monacaptradingpro.com`

1. **Update Backend .env on Emergent:**
   ```env
   APP_URL=https://www.monacaptradingpro.com
   CORS_ORIGINS=https://www.monacaptradingpro.com,https://monacaptradingpro.com,http://localhost:3000
   ```

2. **Restart backend:**
   ```bash
   sudo supervisorctl restart backend
   ```

3. **Update frontend .env:**
   ```env
   REACT_APP_BACKEND_URL=https://monacaptrade.preview.emergentagent.com
   ```

4. **Redeploy frontend** (on Vercel/Netlify)

---

## 🎨 Custom Domain Setup

### For Vercel:
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. SSL certificate auto-generated

### For Netlify:
1. Go to Netlify Dashboard → Domain Settings
2. Add custom domain
3. Update DNS records
4. SSL certificate auto-generated

---

## 🐛 Troubleshooting

### CORS Error in Browser:
```
Access-Control-Allow-Origin header is missing
```
**Fix:** Add your domain to `CORS_ORIGINS` in backend .env and restart

### API Request Failed:
```
Failed to fetch
```
**Fix:** Check `REACT_APP_BACKEND_URL` is correct in frontend

### Email Not Sending:
```
SMTP connection failed
```
**Fix:** Verify SMTP credentials in backend .env

### Login Not Working:
```
401 Unauthorized
```
**Fix:** Clear browser localStorage and try again

---

## 📊 Recommended Setup

```
┌─────────────────────────────────────────┐
│   Frontend (Your Domain/Vercel)        │
│   www.monacaptradingpro.com            │
│   • React Application                   │
│   • Static Files                        │
│   • User Interface                      │
└─────────────────┬───────────────────────┘
                  │
                  │ API Calls
                  │
┌─────────────────▼───────────────────────┐
│   Backend (Emergent.sh)                 │
│   monca-trading-clone.preview...        │
│   • FastAPI Server                      │
│   • MongoDB Database                    │
│   • Email Service                       │
│   • Authentication                      │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Start Commands

```bash
# 1. Prepare frontend for deployment
cd /app/frontend
yarn build

# 2. Deploy to Vercel (easiest)
vercel

# 3. Or deploy to Netlify
netlify deploy --prod

# 4. Update CORS on Emergent
# Edit /app/backend/.env with your domain
# Restart: sudo supervisorctl restart backend
```

---

## ✨ Benefits of This Setup

- ✅ **Backend stays on Emergent** - No server management needed
- ✅ **MongoDB included** - Database handled by Emergent
- ✅ **Automatic email sending** - Using your mail server
- ✅ **Fast frontend hosting** - CDN delivery on Vercel/Netlify
- ✅ **Free SSL certificates** - HTTPS automatic
- ✅ **Easy updates** - Push to Git, auto-deploy
- ✅ **Scalable** - Both frontend and backend scale independently

---

## 💡 Pro Tips

1. **Use environment variables** - Never hardcode URLs
2. **Test locally first** - `yarn start` before deploying
3. **Check CORS settings** - Most common deployment issue
4. **Monitor email logs** - Check backend logs for email status
5. **Keep credentials secure** - Never commit .env files

---

## 📞 Need Help?

Common issues and fixes:
- CORS errors → Update backend CORS_ORIGINS
- Email not sending → Check SMTP settings
- Login fails → Clear browser cache/localStorage
- API timeout → Check Emergent backend is running

---

That's it! Your frontend will be hosted externally while Emergent handles all the backend magic. 🚀
