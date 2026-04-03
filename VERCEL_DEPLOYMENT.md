# Vercel Deployment Guide

This guide covers deploying your portfolio to Vercel (frontend) and a separate service (backend).

## Prerequisites

- GitHub account with your portfolio repository pushed
- Backend deployed to Render, Railway, or similar (see Backend Deployment section)
- Vercel account (free)

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Vercel         │         │  Render/Railway  │
│  Frontend       │◄────────│  Backend         │
│  (React/Vite)   │         │  (Express/Node)  │
└─────────────────┘         └──────────────────┘
```

## Step 1: Deploy Backend First

### Option A: Deploy to Render (Recommended)

1. **Push code to GitHub**
   - Make sure your code is on GitHub
   - Ensure `.env` is in `.gitignore`

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended)

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - Configure:
     - **Name**: `portfolio-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Root Directory**: `Server`
     - **Plan**: Free

   4. **Add Environment Variables**
      - Click "Environment"
      - Add these variables:
        ```
        MONGODB_URI=mongodb+srv://...
        JWT_SECRET=your_secret_key_here
        EMAIL_USER=your_email@gmail.com
        EMAIL_PASSWORD=your_app_password
        FRONTEND_URL=https://your-vercel-domain.vercel.app
        NODE_ENV=production
        ```

   5. **Deploy**
      - Click "Create Web Service"
      - Wait for deployment to complete
      - Note the URL (e.g., `https://portfolio-backend.onrender.com`)

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in Railway dashboard
6. Deploy

### Option C: Deploy to Cyclic

1. Go to [cyclic.sh](https://cyclic.sh)
2. Sign up with GitHub
3. Deploy from repository
4. Add environment variables
5. Deploy

## Step 2: Deploy Frontend to Vercel

### 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project" or "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"

### 2. Configure Build Settings

Vercel should auto-detect and use `vercel.json`:
- **Framework**: `Vite`
- **Build Command**: `npm --prefix Client run build`
- **Output Directory**: `Client/dist`
- **Install Command**: `npm install && npm install --include=dev --prefix Client`

### 3. Set Environment Variables (IMPORTANT!)

**This is the critical step for your backend to work:**

1. Go to your project's **Settings**
2. Click **Environment Variables**
3. **Add new variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - Replace with your actual backend URL from Step 1
   - Click "Save"

4. Apply the environment variable to **Production** (checkbox should be checked)

### 4. Trigger Deployment

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Select "Redeploy"
4. Wait for deployment to complete

### 5. Verify

Visit your Vercel domain and check:
- Frontend loads correctly
- Navigation works
- Data loads (skills, projects, experience)
- No 404 or network errors in console
- Admin dashboard can fetch data

## Troubleshooting

### 1. API calls return 404

**Cause**: `VITE_API_URL` not set correctly

**Solution**:
- Check Vercel environment variables
- Ensure `VITE_API_URL` is set to: `https://your-backend-url/api`
- Redeploy frontend

### 2. CORS errors

**Cause**: Backend CORS config doesn't allow Vercel domain

**Solution**:
- Update `Server/src/server.js` FRONTEND_URL environment variable
- Set `FRONTEND_URL=https://your-vercel-app.vercel.app` in backend
- Redeploy backend

### 3. Components stuck in LOADING state

**Cause**: API requests failing silently

**Solution**:
- Open browser DevTools → Console
- Check for error messages
- Verify backend is running: `curl https://your-backend/api/skills`
- Check `VITE_API_URL` environment variable is set

### 4. "Cannot GET /"

**Cause**: Build output directory wrong

**Solution**:
- Verify `vercel.json` has `"outputDirectory": "Client/dist"`
- Check Vercel build logs
- Redeploy

## Environment Variables Summary

### Vercel (Frontend) Environment Variables

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend Environment Variables (Render/Railway/etc)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
JWT_SECRET=your_random_secret_key_min_32_chars
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
PORT=3000 (or whatever the service assigns)
```

## Monitoring & Logs

### Check Frontend Logs

1. On Vercel dashboard
2. Go to project → **Deployments**
3. Click on deployment
4. View **Build Logs** and **Runtime Logs**

### Check Backend Logs

**Render**:
- Dashboard → Select service
- View **Logs** tab in real-time

**Railway**:
- Dashboard → Select deployment
- View **Logs** tab

## Domain Management

### Add Custom Domain to Vercel

1. Go to Vercel project **Settings**
2. Click **Domains**
3. Add your custom domain
4. Follow DNS setup instructions
5. Update backend `FRONTEND_URL` if needed

## Performance Tips

1. **Vercel Analytics**: Enable in Vercel dashboard to monitor performance
2. **Backend Health**: Monitor backend uptime with UptimeRobot (free)
3. **Database**: Monitor MongoDB Atlas performance

## Common Commands

```bash
# Test backend locally pointing to Vercel frontend
FRONTEND_URL=https://your-vercel-app.vercel.app npm run dev

# Check if backend is responsive
curl -I https://your-backend-url.onrender.com/api/skills

# Verify environment variables on Vercel (view build logs)
# Look for: "API Base URL: https://..." in browser console
```

## Need Help?

Check logs:
1. Browser console (F12 → Console tab)
2. Vercel build logs
3. Backend service logs
4. Network tab to see failed requests

Common error messages:
- `Failed to fetch`: Backend URL wrong or backend down
- `CORS error`: Frontend URL not allowed on backend
- `Cannot GET /`: Build output wrong
