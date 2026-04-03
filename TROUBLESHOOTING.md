# Troubleshooting & Quick Reference

## 🚀 Quick Start (Copy-Paste)

### 1. Backend Setup

```bash
# Navigate to server directory
cd Server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env - see section below

# Start development server
npm run dev
```

### 2. Configure .env

Edit `Server/.env`:

```env
# MongoDB Connection - Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/portfolio_db?retryWrites=true&w=majority

# JWT Secret - Generate a random string
JWT_SECRET=your-super-secret-key-here-change-this

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password-from-gmail

CONTACT_EMAIL=your-email@gmail.com

# Server settings
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup (in new terminal)

```bash
cd Client

npm install  # if not done already

npm run dev  # starts on http://localhost:5173
```

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error:** `Cannot find module 'express'`

```bash
# Solution: Install dependencies
cd Server
npm install
```

**Error:** `MONGODB_URI is not defined`

1. Create `Server/.env` file
2. Copy from `Server/.env.example`
3. Fill in actual values:
   - Get MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/)
   - Use Format: `mongodb+srv://username:password@cluster.xxx...`

**Error:** `Port 5000 already in use`

```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

- MongoDB not running locally (if using local MongoDB)
- Or MONGODB_URI is incorrect
- Check `.env` for correct MongoDB URI

---

### Frontend Can't Connect to Backend

**Error:** `CORS error` or `Failed to fetch from /api/...`

1. Ensure backend is running on `http://localhost:5000`
2. Check `FRONTEND_URL` in `Server/.env`:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```
3. Check `Client/.env.development`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Restart backend after changing env vars

**Error:** `Network Error` when calling API

```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running",...}
```

**Error:** `localhost:5000 refused to connect`

- Backend not running: `npm run dev` in Server folder
- Check PORT in `.env`
- Check firewall settings

---

### Email Not Sending

**Error:** `Email service connection failed`

1. Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
2. For Gmail:
   - Enable 2FA: https://myaccount.google.com/security
   - Create App Password: https://myaccount.google.com/apppasswords
   - Select Mail → Windows Computer → Generate
   - Copy password into `.env` (16-char password with spaces removed)

3. Check if "Less secure app access" is needed for older Gmail accounts

**Error:** `Invalid login credentials`

- Double-check `EMAIL_PASSWORD` (use app password, not regular password)
- Email might require 2FA to be enabled first

**Email goes to spam:**

- Check spam/junk folder
- Email domain reputation issue (common for first emails)
- Add to contacts to whitelist sender

---

### Database Issues

**Error:** `MongoNetworkError`

1. Check MongoDB Atlas is accessible
2. Allow IP in Network Access:
   - Go to MongoDB Atlas
   - Network Access
   - Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0)

3. Verify connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

**Error:** `authentication failed`

- Wrong username or password
- Reset credentials in MongoDB Atlas
- Copy connection string again

**Database getting too full:**

- Delete old contact messages
- Or upgrade MongoDB Atlas cluster

---

### Authentication Issues

**Error:** `Invalid token` or `Token expired`

- Token expires after time set in `JWT_EXPIRE` (default 7 days)
- User is automatically redirected to login
- Login again to get new token

**Error:** `401 Unauthorized` on protected routes

- Ensure token is in `Authorization` header
- Format: `Authorization: Bearer YOUR_TOKEN`
- Check token is valid and not expired

**Can't register admin account**

- Only allow one admin registration (first-time only)
- To reset: delete User from MongoDB and try again

---

### Frontend Issues

**Error:** `Module not found`

```bash
cd Client
npm install   # Install all dependencies
npm run dev   # Restart dev server
```

**Build fails**

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Styles not loading**

- Ensure Tailwind CSS is working
- Check `tailwind.config.js` exists
- Restart dev server

---

### Deployment Issues

**Error:** `Build failed` on Render/Railway

1. Check build logs in dashboard
2. Common causes:
   - Missing environment variable
   - Node.js version mismatch
   - Syntax error in code

**Error:** `Application error` after deployment

1. Check logs on deployment platform
2. Ensure all environment variables are set
3. Verify MongoDB connection string is correct

**Error:** `502 Bad Gateway`

- Backend crashed or didn't start
- Check deployment logs
- Verify environment variables

---

## ✅ Verification Checklist

### Backend Setup

- [ ] `npm install` completed without errors
- [ ] `.env` file created with all required variables
- [ ] `MONGODB_URI` is set and correct
- [ ] `JWT_SECRET` is set to a secure random value
- [ ] `EMAIL_USER` and `EMAIL_PASSWORD` configured
- [ ] Backend starts with `npm run dev` without errors
- [ ] `curl http://localhost:5000/api/health` returns 200

### Database

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with correct credentials
- [ ] IP access allowed
- [ ] Connection string copied correctly

### Email

- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] App password entered in `.env`
- [ ] Email service validates on startup

### Frontend Setup

- [ ] `npm install` completed in Client folder
- [ ] `.env.development` created and configured
- [ ] `npm run dev` starts without errors
- [ ] Frontend accessible at `http://localhost:5173`

### Integration

- [ ] Can see API health check from frontend console
- [ ] Can register admin account
- [ ] Can login and get token
- [ ] Can view projects (GET /api/projects)
- [ ] Can submit contact form
- [ ] Can receive email notification

### Before Deployment

- [ ] All endpoints tested locally
- [ ] Frontend builds successfully
- [ ] Environment variables documented
- [ ] Database backups enabled
- [ ] Error logging working
- [ ] Rate limiting configured
- [ ] CORS settings correct

---

## 📞 Quick Reference

### Important URLs

| Item | URL |
|------|-----|
| Frontend Dev | http://localhost:5173 |
| Backend Dev | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas/ |
| Gmail App Passwords | https://myaccount.google.com/apppasswords |

### Key Files

| File | Purpose |
|------|---------|
| `Server/.env` | Backend environment variables |
| `Server/src/server.js` | Main Express server |
| `Client/.env.development` | Frontend dev API URL |
| `Client/src/utils/api.ts` | API client service |
| `Client/vite.config.ts` | Vite configuration |

### Key Commands

```bash
# Backend
cd Server
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5000)
npm start          # Start production server

# Frontend
cd Client
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
```

### Default Ports

- **Frontend Dev:** 5173
- **Backend:** 5000
- **MongoDB:** 27017 (if local)

---

## 🆘 Getting Help

1. **Check error message** - Read full error in terminal
2. **Check logs** - Backend logs show detailed errors
3. **Verify .env** - Most issues are missing/wrong env vars
4. **Restart servers** - Kill and restart both frontend & backend
5. **Check Network** - Confirm backend is running
6. **Clear caches** - `npm cache clean --force`
7. **Reinstall** - `rm node_modules && npm install`

---

## 📝 Common Solutions

### "Cannot read property 'password'"

Backend issue accessing User model. Restart backend.

### "fetch() failed"

Frontend can't reach backend. Check:
1. Backend is running
2. CORS is configured
3. Correct API URL in `.env`

### "Duplicate key error"

Email already registered. Use different email or reset database.

### "Rate limit exceeded"

Too many API calls. Wait 1 hour or change rate limit in `src/server.js`.

### "Validation error" on contact form

Check field requirements:
- Name: 2-50 characters
- Email: valid format
- Message: 10-5000 characters

---

## 🎯 Next Steps After Setup

1. ✅ Get both frontend & backend running locally
2. ✅ Register admin account
3. ✅ Create test projects
4. ✅ Test contact form
5. ✅ Add your portfolio content
6. ✅ Customize styling
7. ✅ Deploy to production (Render/Railway/Cyclic)

---

For detailed documentation, see:
- [Server/README.md](./Server/README.md) - API details
- [Server/DEPLOYMENT.md](./Server/DEPLOYMENT.md) - Deployment guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Frontend integration
