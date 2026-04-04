# Vercel Deployment Guide

This project can be deployed as a single Vercel app: the Vite frontend is built from `Client/`, and the API is served from `api/[...path].js`.

## Prerequisites

- GitHub account with your portfolio repository pushed
- Vercel account
- A production `JWT_SECRET` ready to add in Vercel

## Architecture

```
┌──────────────────────────────────────────────┐
│ Vercel                                       │
│  - Static frontend from Client/dist          │
│  - Serverless API from api/[...path].js      │
└──────────────────────────────────────────────┘
```

## Deploy To Vercel

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
- **Install Command**: `npm install --legacy-peer-deps && npm install --include=dev --prefix Client`

### 3. Set Environment Variables (IMPORTANT!)

Add these in the Vercel project settings:

1. Go to your project's **Settings**
2. Click **Environment Variables**
3. Add `JWT_SECRET` with a strong random value
4. Create and attach a **Vercel Blob** store from the project's **Storage** tab
5. Verify `BLOB_READ_WRITE_TOKEN` is available in the project environment variables
6. Add `BLOB_ACCESS=private` if your Blob store is private
7. Optionally add `VITE_API_URL` only if you intentionally want the frontend to call an external API instead of the same Vercel deployment

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

### 6. Understand Data Persistence

The API supports **durable Vercel Blob storage** for production content:

- When `BLOB_READ_WRITE_TOKEN` is configured, portfolio data and messages are stored durably in Vercel Blob
- When Blob storage is not configured, the API falls back to `/tmp`, which is ephemeral on Vercel
- For production, durable persistence requires the Blob store to be attached to the same Vercel project

Recommended setup:

- Use a **private** Blob store for admin-managed content
- Set `BLOB_ACCESS=private`
- Redeploy after attaching the Blob store

## Troubleshooting

### 1. API calls return 404

**Cause**: Frontend build or route fallback is misconfigured, or the request is not going to `/api`

**Solution**:
- Check Vercel build logs
- Ensure requests resolve to `/api/...` on the deployed domain
- Only set `VITE_API_URL` if you are using an external backend
- Redeploy frontend

### 2. CORS errors

**Cause**: Requests are going to a different backend domain

**Solution**:
- Prefer same-origin `/api` on Vercel
- If using an external API, allow your Vercel domain there and set `VITE_API_URL`

### 3. Components stuck in LOADING state

**Cause**: API requests failing silently

**Solution**:
- Open browser DevTools → Console
- Check for error messages
- Verify API is running: `curl https://your-vercel-domain.vercel.app/api/skills`
- Check `JWT_SECRET` is configured in Vercel

### 4. "Cannot GET /"

**Cause**: Build output directory wrong

**Solution**:
- Verify `vercel.json` has `"outputDirectory": "Client/dist"`
- Check Vercel build logs
- Redeploy

### 5. Messages or admin changes disappear after some time

**Cause**: Vercel Blob is not configured, so the API is using ephemeral `/tmp` storage

**Solution**:
- Go to Vercel project → **Storage**
- Create and attach a Blob store
- Confirm `BLOB_READ_WRITE_TOKEN` exists in the project environment variables
- Set `BLOB_ACCESS=private` when using a private store
- Redeploy the project

## Environment Variables Summary

### Vercel (Frontend) Environment Variables

```
JWT_SECRET=your_random_secret_key_min_32_chars
BLOB_READ_WRITE_TOKEN=added_automatically_when_blob_store_is_connected
BLOB_ACCESS=private
```

### Optional External API Variable

```
VITE_API_URL=https://your-external-api.example.com/api
```

## Monitoring & Logs

### Check Frontend Logs

1. On Vercel dashboard
2. Go to project → **Deployments**
3. Click on deployment
4. View **Build Logs** and **Runtime Logs**

### Check Backend Logs

This project's backend runs as a Vercel serverless function, so use **Runtime Logs** in the Vercel deployment.

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
# Check if the deployed API is responsive
curl https://your-vercel-domain.vercel.app/api/skills

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
- `Failed to fetch`: API route failing or wrong external API URL
- `CORS error`: Frontend is pointed at a different backend domain without CORS enabled
- `Cannot GET /`: Build output wrong
