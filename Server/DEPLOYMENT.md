# Deployment Guide

Complete step-by-step guide to deploy your MERN portfolio to production.

## Overview

You can deploy the backend to several platforms:
1. **Render** (Recommended - free tier available)
2. **Railway**
3. **Cyclic**
4. **Heroku** (still available but paid)

The frontend will be served from the same Express server in production.

## Prerequisites

- Backend code on GitHub/GitLab repository
- MongoDB Atlas account (free tier)
- Deployment platform account

## 1. MongoDB Atlas Setup

### Create a Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/)
2. Sign up or log in
3. Create a new project
4. Create a cluster:
   - Choose "Free" tier
   - Select your preferred region
   - Click "Create Cluster"

### Create Database User

1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Create a username and generate a secure password
4. Note the credentials (you'll need them for `.env`)

### Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string
5. Replace `<password>` and `<username>` with your credentials

**Example:**
```
mongodb+srv://admin:mypassword@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority
```

### Allow IP Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

## 2. Deployment to Render

### Step 1: Prepare Repository

1. Ensure your code is pushed to GitHub
2. Make sure `.env` is in `.gitignore`
3. `package.json` should have these scripts:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'Backend built successfully'"
  }
}
```

### Step 2: Create Render Account

1. Go to [Render](https://render.com/)
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### Step 3: Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:

   | Setting | Value |
   |---------|-------|
   | Name | `portfolio-backend` |
   | Environment | `Node` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Plan | Free |

4. Click "Create Web Service"

### Step 4: Add Environment Variables

1. Go to your service dashboard
2. Click "Environment" in the left sidebar
3. Add all variables from `.env.example`:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourportfolio.com
CONTACT_EMAIL=your_email@gmail.com
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-render-domain.onrender.com
```

5. Click "Save"

### Step 5: Verify Deployment

1. Wait for deployment to complete
2. Visit your backend URL (e.g., `https://portfolio-backend.onrender.com`)
3. Check the health endpoint: `https://portfolio-backend.onrender.com/api/health`

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 3. Deployment to Railway

### Step 1: Create Railway Account

1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your portfolio repository
4. Railway automatically detects Node.js project

### Step 3: Set Environment Variables

1. Go to your project
2. Click on the service
3. Go to "Variables" tab
4. Add all environment variables

```
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=...
EMAIL_PASSWORD=...
EMAIL_FROM=...
CONTACT_EMAIL=...
NODE_ENV=production
FRONTEND_URL=https://your-domain.up.railway.app
```

### Step 4: Verify

1. Go to "Deployments" tab
2. Check logs to ensure server started
3. Your backend URL will be provided in the Railway dashboard

## 4. Deployment to Cyclic

### Step 1: Create Account

1. Go to [Cyclic.sh](https://www.cyclic.sh/)
2. Sign up with GitHub

### Step 2: Deploy

1. Click "Deploy"
2. Select your portfolio repository
3. Choose Node.js runtime

### Step 3: Configure Environment

1. Go to Settings
2. Under "Environment", add variables:

```
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=...
EMAIL_PASSWORD=...
EMAIL_FROM=...
CONTACT_EMAIL=...
NODE_ENV=production
FRONTEND_URL=https://your-cyclic-domain.cyclic.sh
```

## 5. Frontend Deployment Setup

### Option A: Serve from Backend (Recommended)

The backend automatically serves the React build in production.

1. **Build the frontend:**

```bash
cd Client
npm run build
```

2. **Update backend to serve frontend:**

In `src/server.js`, the code already serves:
```javascript
if (NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../Client/dist');
  app.use(express.static(clientBuildPath));
}
```

3. **Deploy to Render/Railway/Cyclic:**

Your frontend will automatically be served at `/` and API at `/api`

### Option B: Deploy Frontend Separately

If you prefer to deploy frontend to Vercel/Netlify:

1. **Build frontend:**
```bash
cd Client
npm run build
```

2. **Deploy to Vercel:**

```bash
npm install -g vercel
vercel
```

3. **Update `.env.production` in Client:**

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

4. **Rebuild and redeploy:**

```bash
npm run build
vercel --prod
```

## Environment Variables Setup

### For Email Service (Gmail)

1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Use generated password for `EMAIL_PASSWORD`

### For JWT Secret

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Production Checklist

Before going live, ensure:

- [ ] MongoDB Atlas configured with secure credentials
- [ ] Environment variables set on deployment platform
- [ ] FRONTEND_URL matches your domain
- [ ] JWT_SECRET is a strong random string
- [ ] Email service credentials verified
- [ ] CORS properly configured for your domain
- [ ] Rate limiting settings suitable for your traffic
- [ ] Logging configured for monitoring
- [ ] Backups enabled for MongoDB
- [ ] SSL/HTTPS enabled (automatic with Render/Railway/Cyclic)

## Monitoring & Logs

### View Logs

**Render:**
- Dashboard → Logs tab

**Railway:**
- Deployments → View logs

**Cyclic:**
- Monitoring → Logs

### Monitor Performance

- Check error logs regularly
- Monitor API response times
- Track database performance
- Review email delivery status

## Troubleshooting

### "Cannot find module"

```bash
# Redeploy and ensure dependencies are installed
npm install
```

### "MONGODB_URI is not defined"

- Check Environment Variables on your platform
- Ensure exact variable names match

### "Email not sending"

- Verify EMAIL_USER and EMAIL_PASSWORD
- Check spam folder
- Ensure app password is used, not regular password

### "CORS error"

- Update FRONTEND_URL in environment variables
- Redeploy to apply changes

### "Build fails"

- Check logs for specific error
- Ensure all dependencies in package.json
- Verify Node.js version compatibility

## Custom Domain Setup

### Render

1. Go to Service Settings
2. Scroll to "Custom Domain"
3. Enter your domain
4. Update DNS records as shown
5. Wait for SSL certificate (automatic)

### Railway

1. Go to Generate Domain
2. Add custom domain
3. Update DNS CNAME record
4. SSL automatic

### Cyclic

1. Settings → Domain
2. Add custom domain
3. Update DNS records
4. SSL automatic

## Maintenance

### Regular Tasks

- Monitor error logs
- Check email delivery
- Update dependencies periodically
- Review performance metrics
- Backup MongoDB regularly

### Update Backend

```bash
# Make changes locally
# Commit and push to GitHub
git push origin main

# Platform automatically redeploys on push
# (if configured with GitHub integration)
```

## Cost Overview

| Platform | Free Tier | Limitations |
|----------|-----------|------------|
| Render | ✅ Yes | Sleeps after 15 min inactivity |
| Railway | ✅ Yes ($5/month credit) | Usage-based pricing |
| Cyclic | ✅ Yes | Limited resources |
| MongoDB Atlas | ✅ Yes | 5GB storage, 3 replicas |

## Security Best Practices

1. Never commit `.env` files
2. Use strong JWT secrets
3. Keep dependencies updated
4. Monitor error logs for breaches
5. Use HTTPS only
6. Implement rate limiting
7. Validate all inputs
8. Use environment variables for secrets

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Cyclic Documentation](https://docs.cyclic.sh/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)

---

**Your MERN portfolio is now live! 🎉**
