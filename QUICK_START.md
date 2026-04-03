# 🚀 QUICK REFERENCE - Get Started in 5 Minutes

## ⚡ The Fastest Way to Get Running

### Step 1: Backend Setup (2 minutes)

```bash
cd Server
npm install
cp .env.example .env
```

**Edit `.env` file:** Add these 3 critical values:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
JWT_SECRET=any-random-string-like-ajdsklmjlksdjfh
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password-from-gmail
```

**Start backend:**
```bash
npm run dev
```

✅ Backend runs on `http://localhost:5000`

### Step 2: Frontend Setup (1 minute)

New terminal:
```bash
cd Client
npm install
npm run dev
```

✅ Frontend runs on `http://localhost:5173`

### Step 3: Test Everything (2 minutes)

1. Open `http://localhost:5173` in browser
2. Click Admin/Register
3. Register account with test email
4. Login with that account
5. Create a test project
6. Submit contact form
7. Check email for confirmation

🎉 **Done!** Everything is working!

---

## 📚 Key Files Location

| What | Where | What to Do |
|------|-------|-----------|
| Backend config | `Server/.env.example` | Copy to `.env` and fill in |
| Frontend API setup | `Client/src/utils/api.ts` | Already configured |
| Main backend file | `Server/src/server.js` | Ready to run |
| Backend README | `Server/README.md` | Read for details |

---

## 🔐 How to Get Required Values

### MongoDB URI
1. Go to https://www.mongodb.com/cloud/atlas/
2. Create free cluster
3. Click Connect
4. Copy connection string
5. Replace `<username>` and `<password>`

### Email (Gmail)
1. Enable 2FA: https://myaccount.google.com/security
2. App Passwords: https://myaccount.google.com/apppasswords
3. Select Mail → Windows Computer
4. Copy 16-char password
5. Use in `EMAIL_PASSWORD`

### JWT Secret
Any random string like: `jkdasjkdlajsldkjsldkjklasjdl`

---

## 💡 What's Already Built For You

✅ **27 API Endpoints** - All working
✅ **6 Database Models** - User, Project, Contact, Skill, Experience, CaseStudy
✅ **Complete Authentication** - JWT-based admin login
✅ **Email Service** - Automatic contact form emails
✅ **Security** - Hashing, validation, rate limiting
✅ **Error Handling** - Professional error responses
✅ **Logging** - Request and error logging
✅ **Frontend Integration** - API service ready to use

---

## 🆘 If Something Goes Wrong

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` in that folder |
| Backend won't start | Check .env file, especially MONGODB_URI |
| Can't connect to MongoDB | Check connection string format, IP whitelist |
| CORS error | Restart backend after changing .env |
| Email not sending | Use Gmail app password, not regular password |
| Port 5000 already in use | Change PORT in .env or kill other process |

**Detailed help:** see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📖 Documentation Files (By Purpose)

**Just Starting?**
→ This file (you're reading it!)

**Want Overview?**
→ [README.md](./README.md)

**Need to Deploy?**
→ [Server/DEPLOYMENT.md](./Server/DEPLOYMENT.md)

**Using the API in Frontend?**
→ [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

**API Details?**
→ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

**Issues?**
→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Navigation?**
→ [INDEX.md](./INDEX.md)

---

## ⏱️ Typical Timeline

| Task | Time |
|------|------|
| Set up backend | 2 min |
| Set up frontend | 1 min |
| Get .env values | 5-10 min |
| Test everything | 2 min |
| Add portfolio data | 30 min |
| Deploy (Render/Railway) | 20 min |
| **Total** | **1 hour** |

---

## 🎯 Next Steps

1. ✅ Get it running locally (15 min)
2. ✅ Add your portfolio content (30 min)
3. ✅ Deploy to Render/Railway (20 min)
4. ✅ Add custom domain (10 min)
5. ✅ Share your portfolio! 🎉

---

## 💻 Commands You'll Use

```bash
# Backend development
cd Server && npm run dev

# Frontend development
cd Client && npm run dev

# Build for production
cd Client && npm run build

# Deploy
# Follow Server/DEPLOYMENT.md
```

---

## 📞 Key URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`
- Health: `http://localhost:5000/api/health`

---

**That's it! You're ready to go.** 🚀

Start with Step 1 above, then refer to documentation as needed.

