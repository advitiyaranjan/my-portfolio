# 🚀 Local Server Status

## ✅ Running Locally

Both servers are now running and fully functional!

### Frontend
- **URL**: http://localhost:5174/
- **Status**: ✅ Running (Vite dev server)
- **Hot Reload**: ✅ Enabled

### Backend API  
- **URL**: http://localhost:5000/api/
- **Status**: ✅ Running (Node.js Express server)
- **Storage**: ✅ JSON files in `.data/` directory

---

## 🔑 Default Admin Credentials

```
Email: advityaranjan1@gmail.com
Password: admin123
```

Admin Panel: http://localhost:5174/admin/login

---

## 📊 Available Data

✅ **Skills**: 3 categories (Frontend, Backend, Tools)  
✅ **Projects**: 1 sample project  
✅ **Experience**: 1 work experience record  
✅ **Achievements**: 1 achievement  
✅ **Portfolio Info**: Social links configured  
✅ **Admin User**: Created and ready to login  

---

## 🧪 Quick API Tests

### Get Skills
```bash
curl http://localhost:5000/api/skills
```

### Get Projects
```bash
curl http://localhost:5000/api/projects
```

### Get Portfolio
```bash
curl http://localhost:5000/api/portfolio
```

### Check API Health
```bash
curl http://localhost:5000/health
```

---

## 🎯 What's Working

✅ **Public Pages**: Home, About, Projects, Skills, Experience, Achievements, Contact  
✅ **Admin Login**: Email/password authentication  
✅ **Admin Dashboard**: View stats and contact messages  
✅ **CRUD Operations**: Create, read, update, delete content  
✅ **Contact Form**: Submit messages (stored in JSON)  
✅ **API Authentication**: JWT-based protection on admin endpoints  

---

## 📁 Data Storage

All data is stored in `.data/` directory:

```
.data/
├── users.json           (admin users)
├── skills.json          (skills data)
├── projects.json        (portfolio projects)
├── experiences.json     (work experience)
├── achievements.json    (achievements)
├── contact.json         (contact messages)
├── portfolio.json       (portfolio info)
└── case-studies.json    (case studies)
```

---

## 🔄 How to Run Simultaneously

```bash
# Terminal 1: Start API Server
npm run dev:api

# Terminal 2: Start Frontend
npm run dev:client
```

Or run both at once:
```bash
npm run dev
```

---

## 🛑 To Stop Servers

Press `Ctrl+C` in each terminal

---

## 📝 Next Steps

1. Visit http://localhost:5174/ to see the frontend
2. Click "Admin" button in navbar or goto http://localhost:5174/admin/login
3. Login with credentials above
4. Update portfolio information
5. Add your own projects, skills, and experiences

---

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Data not appearing?**
- Check `.data/` directory exists
- Run `node api/seed.js` to reinitialize data

**API not responding?**
- Check API server is running on port 5000
- Check vite config proxy points to `http://localhost:5000`

---

Enjoy your serverless portfolio! 🎉
