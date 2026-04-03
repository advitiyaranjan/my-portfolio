# Serverless Portfolio - Complete Setup Guide

This project is now fully serverless with JSON file storage instead of a database. Everything runs on Vercel without external dependencies!

## 🎯 Project Structure

```
Portfolio/
├── Client/                    # React frontend (Vite)
│   ├── src/
│   ├── package.json
│   ├── .env.development
│   ├── .env.production
│   └── vite.config.ts
├── api/                       # Serverless functions (Vercel)
│   ├── [...path].js          # Main handler
│   ├── handler.js            # API logic
│   ├── seed.js               # Initialize data
│   └── lib/
│       ├── storage.js        # JSON file storage
│       └── auth.js           # Authentication
├── .data/                     # JSON data (local only)
│   ├── users.json
│   ├── skills.json
│   ├── projects.json
│   └── ...
└── vercel.json              # Vercel configuration
```

## ✨ Features

✅ **Fully Serverless** - No backend server needed  
✅ **No Database** - JSON file storage  
✅ **Same UI/Functionality** - No changes to frontend  
✅ **Fast Deployment** - Deploy to Vercel in seconds  
✅ **Development & Production** - Works locally and on Vercel  
✅ **Authentication** - JWT-based admin login  
✅ **API** - Full REST API for all content management  

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Root
npm install

# Frontend
cd Client
npm install
cd ..

# OR install all at once
npm install && cd Client && npm install && cd ..
```

### 2. Set Environment Variables

Create `.env` in the root:

```env
JWT_SECRET=your_super_secret_key_here_min_32_chars_change_in_production
NODE_ENV=development
VITE_API_URL=/api
```

### 3. Run Locally

```bash
# Terminal 1: Frontend
cd Client
npm run dev

# Terminal 2: Backend (serverless functions)
# Must be accessed via Client's Vite proxy
# API calls to /api are automatically handled by Vercel dev server
```

Frontend: http://localhost:5173/  
API: Proxied from `/api`

### 4. Initialize Data (First Time)

The data is automatically initialized on first API request. Default admin credentials:

- **Email**: advityaranjan1@gmail.com  
- **Password**: admin123

Change these in production!

## 📊 Data Storage

### Local Development

Data is stored in `.data/` directory as JSON files:

```
.data/
├── users.json          # Admin users
├── skills.json         # Skills data
├── projects.json       # Portfolio projects
├── experiences.json    # Work experience
├── achievements.json   # Leadership achievements
├── contact.json        # Contact form submissions
├── portfolio.json      # Portfolio info
└── case-studies.json   # Case studies
```

### Vercel Deployment

On Vercel, data is stored in `/tmp` (ephemeral storage):
- **Data persists** during the same deployment
- **Data resets** when Vercel redeploys the function
- For persistent storage, add a database later

**Recommendation**: For production, add MongoDB to persist data between deployments.

## 🔐 API Endpoints

All endpoints require authentication except public ones (indicated with 🔓):

### Public Endpoints

```
🔓 GET    /api/skills              # All skills
🔓 GET    /api/projects            # All projects
🔓 GET    /api/experience          # All work experience
🔓 GET    /api/achievements        # All achievements
🔓 GET    /api/portfolio           # Portfolio info
🔓 POST   /api/contact             # Submit contact form
🔓 GET    /api/case-studies        # All case studies
```

### Authentication

```
🔓 POST   /api/auth/register       # Register admin
🔓 POST   /api/auth/login          # Login
🔐 GET    /api/auth/me             # Current user
```

### Admin Endpoints (Protected)

```
🔐 POST   /api/skills              # Create skill
🔐 PUT    /api/skills/:id          # Update skill
🔐 DELETE /api/skills/:id          # Delete skill

🔐 POST   /api/projects            # Create project
🔐 PUT    /api/projects/:id        # Update project
🔐 DELETE /api/projects/:id        # Delete project

🔐 POST   /api/experience          # Create experience
🔐 PUT    /api/experience/:id      # Update experience
🔐 DELETE /api/experience/:id      # Delete experience

🔐 POST   /api/achievements        # Create achievement
🔐 PUT    /api/achievements/:id    # Update achievement
🔐 DELETE /api/achievements/:id    # Delete achievement

🔐 POST   /api/case-studies        # Create case study
🔐 PUT    /api/case-studies/:id    # Update case study
🔐 DELETE /api/case-studies/:id    # Delete case study

🔐 GET    /api/contact             # View messages
🔐 PUT    /api/portfolio           # Update portfolio
🔐 GET    /api/portfolio/stats     # Portfolio statistics
```

## 📝 API Examples

### Login

```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "advityaranjan1@gmail.com",
    "password": "admin123"
  }'

# Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "...", "email": "..." },
    "token": "eyJhbGci..."
  }
}
```

### Get All Projects

```bash
curl http://localhost:5173/api/projects

# Response:
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### Create Project (Protected)

```bash
curl -X POST http://localhost:5173/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Project",
    "description": "Project description",
    "techStack": ["React", "Node.js"],
    "imageUrl": "https://...",
    "githubLink": "https://github.com/...",
    "liveLink": "https://..."
  }'
```

### Update Portfolio

```bash
curl -X PUT http://localhost:5173/api/portfolio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "socialLinks": {
      "github": "https://github.com/...",
      "linkedin": "https://linkedin.com/in/...",
      "twitter": "https://twitter.com/...",
      "email_link": "mailto:..."
    }
  }'
```

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Convert to serverless with JSON storage"
git push origin main
```

### 2. Import Project on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click **Import**

### 3. Configure Environment Variables

1. In Vercel: Project **Settings** → **Environment Variables**
2. Add these variables:

```
JWT_SECRET=your_super_secret_key_min_32_chars_CHANGE_THIS
NODE_ENV=production
```

3. Click "Save"

### 4. Deploy

1. Go to **Deployments** tab
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete
4. Visit your Vercel domain!

## 📋 Complete Deployment Checklist

- [ ] Push code to GitHub
- [ ] Import project on Vercel
- [ ] Set `JWT_SECRET` environment variable
- [ ] Set `NODE_ENV=production` environment variable
- [ ] Trigger redeploy
- [ ] Test login at `/admin/login`
- [ ] Change default admin password
- [ ] Update portfolio information
- [ ] Add projects and skills
- [ ] Test contact form

## ⚙️ Configuration

### Changing Admin Credentials

1. Login to admin dashboard
2. Go to Admin Settings (look for settings option)
3. Change password

Or delete `.data/users.json` and redeploy to reset to defaults.

### Customizing Data Persistence

To persist data between Vercel deployments, add a database:

1. **MongoDB** (Recommended)
   - Update `api/lib/storage.js`
   - Replace JSONStorage with MongoDB models
   - Update `.env` with `MONGODB_URI`

2. **Alternative Databases**
   - PostgreSQL
   - Firebase Firestore
   - Supabase
   - DynamoDB

## 🔄 Upgrading to Database

If you need persistent storage:

1. **Stop using JSON storage**:
   - Replace `api/lib/storage.js` with database client
   - Update API handlers in `api/handler.js`

2. **Add Environment Variable**:
   ```env
   MONGODB_URI=mongodb+srv://...
   ```

3. **Redeploy**:
   ```bash
   git push origin main
   ```

## 📊 Monitoring

### Check Deployment Status

**Vercel Dashboard**:
- View build logs
- Check deployment URL
- Monitor analytics

### View API Logs

**Vercel Function Logs**:
1. Dashboard → Project
2. Go to **Functions** tab
3. View real-time logs

## 🐛 Troubleshooting

### API returns 404

**Cause**: Function not deployed  
**Solution**: Check Vercel build logs for errors

### Data not persisting

**Cause**: Using ephemeral `/tmp` storage  
**Solution**: Add MongoDB or other persistent storage

### CORS errors

**Cause**: API not accessible  
**Solution**: Check `api/handler.js` CORS headers are set

### Login not working

**Cause**: `JWT_SECRET` not set  
**Solution**: Add `JWT_SECRET` to Vercel environment variables

### Functions timeout

**Current limit**: 10 seconds  
**To increase**: Update `vercel.json` `maxDuration`

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Serverless Functions Guide](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 🎉 You're Done!

Your portfolio is now fully serverless and ready to deploy! 🚀

**Questions?** Check the troubleshooting section above.

---

**Next Steps**:
1. Customize portfolio information
2. Add your projects and skills
3. Set up a custom domain on Vercel
4. Consider adding persistent storage for production
