# MERN Portfolio - Complete Setup Guide

A complete, production-ready portfolio website with React frontend and Node.js/Express backend.

## 🎯 Project Structure

```
Portfolio/
├── Client/                    # React frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.development
│   ├── .env.production
│   └── ...
├── Server/                    # Express backend
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   ├── README.md
│   ├── DEPLOYMENT.md
│   └── ...
└── README.md
```

## ⚡ Quick Start (5 Minutes)

### 1. Backend Setup

```bash
cd Server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values (see step 2)
```

### 2. Configure Environment Variables

Edit `Server/.env`:

```env
# Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority

# Generate a random secret (e.g. openssl rand -hex 32)
JWT_SECRET=your_super_secret_key_here

# Gmail setup (see below)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Default frontend URL
FRONTEND_URL=http://localhost:5173

# Default admin account created on first run
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me_immediately
```

**📧 Gmail Setup:**

1. Go to https://myaccount.google.com/apppasswords
2. Select Mail → Windows Computer
3. Copy the generated password
4. Paste into `EMAIL_PASSWORD`

### 3. Start Backend

```bash
cd Server
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Start Frontend

In a new terminal:

```bash
cd Client
npm install      # if not already done
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📱 Testing the Application

### 1. Register Admin Account

Visit `http://localhost:5173/admin/register`

Or using curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your_admin@example.com",
    "password": "your_secure_password"
  }'
```

### 2. Login

Use the credentials you just created.

### 3. Add Portfolio Data

- Create projects
- Add skills and experience
- Write case studies
- All through the admin panel

### 4. Test Contact Form

Submit a test message through the contact form.

## 🔧 Development Workflow

### Frontend Development

```bash
cd Client
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check for errors
```

### Backend Development

```bash
cd Server
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm test             # Run tests (when configured)
```

## 📦 Key Dependencies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer
- Validation & Security

## 🚀 Ready for Production?

### Step 1: Update Frontend URLs

Edit `Client/.env.production`:

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

### Step 2: Build Frontend

```bash
cd Client
npm run build
```

### Step 3: Deploy

Choose a platform from: [DEPLOYMENT.md](./Server/DEPLOYMENT.md)

Popular options:
- **Render** (Free, Recommended)
- **Railway** (Free tier available)
- **Cyclic** (Free)
- **Vercel** (Frontend + serverless API with Blob storage for durable admin data)

## 📚 Complete API Reference

### Auth Endpoints

```
POST   /api/auth/register      - Register admin
POST   /api/auth/login         - Login admin
GET    /api/auth/me            - Get current user
PUT    /api/auth/profile       - Update profile
PUT    /api/auth/change-password - Change password
```

### Project Endpoints

```
GET    /api/projects           - Get all projects
GET    /api/projects/featured  - Get featured projects
GET    /api/projects/:id       - Get single project
POST   /api/projects           - Create project (admin)
PUT    /api/projects/:id       - Update project (admin)
DELETE /api/projects/:id       - Delete project (admin)
```

### Contact Endpoints

```
POST   /api/contact            - Submit contact form
GET    /api/contact            - Get all messages (admin)
GET    /api/contact/stats      - Get statistics (admin)
GET    /api/contact/:id        - Get message details (admin)
PUT    /api/contact/:id/read   - Mark as read (admin)
DELETE /api/contact/:id        - Delete message (admin)
```

### Skills Endpoints

```
GET    /api/skills             - Get all skills
GET    /api/skills/:id         - Get skill category
POST   /api/skills             - Create skill (admin)
PUT    /api/skills/:id         - Update skill (admin)
DELETE /api/skills/:id         - Delete skill (admin)
```

### Experience Endpoints

```
GET    /api/experience         - Get all experience
GET    /api/experience/:id     - Get single entry
GET    /api/experience/current - Get current role
POST   /api/experience         - Create entry (admin)
PUT    /api/experience/:id     - Update entry (admin)
DELETE /api/experience/:id     - Delete entry (admin)
```

### Case Studies Endpoints

```
GET    /api/case-studies       - Get all case studies
GET    /api/case-studies/:id   - Get single case study
POST   /api/case-studies       - Create case study (admin)
PUT    /api/case-studies/:id   - Update case study (admin)
DELETE /api/case-studies/:id   - Delete case study (admin)
```

## 🔐 Authentication

All admin endpoints require JWT token:

```javascript
// Frontend automatically handles this
const token = localStorage.getItem('portfolioToken');

fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
lsof -i :5000

# If in use, kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Frontend can't connect to backend

1. Ensure backend is running (`http://localhost:5000`)
2. Check CORS settings in `Server/.env`
3. Check browser console for errors
4. Verify API URL in `Client/.env.development`

### MongoDB connection fails

1. Check `MONGODB_URI` format
2. Verify credentials are correct
3. Allow IP access in MongoDB Atlas
4. Test connection manually

### Email not sending

1. Verify `EMAIL_USER` and `EMAIL_PASSWORD`
2. Use App Password, not regular password
3. Enable 2FA on Gmail account
4. Check spam folder

### Validation errors

Check the specific error message - validation happens on both frontend and backend.

## 📖 Documentation

- [Backend README](./Server/README.md) - Detailed API documentation
- [Deployment Guide](./Server/DEPLOYMENT.md) - Production deployment steps
- [Security Guidelines](./Server/README.md#-security-features) - Security best practices

## 🎨 Frontend Components

Key components in your React app:

```
src/
├── components/
│   ├── About.tsx
│   ├── Contact.tsx          - Contact form
│   ├── Experience.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Projects.tsx         - Projects display
│   ├── Skills.tsx           - Skills display
│   ├── CaseStudies.tsx
│   └── ui/                  - Shadcn components
├── utils/
│   └── api.ts              - API client (NEW)
└── main.tsx
```

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin',
  isActive: Boolean,
  timestamps
}
```

### Project
```javascript
{
  title: String,
  description: String,
  techStack: [String],
  imageUrl: String,
  githubLink: String,
  liveLink: String,
  featured: Boolean,
  order: Number,
  timestamps
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  isRead: Boolean,
  isReplied: Boolean,
  ipAddress: String,
  timestamps
}
```

See backend README for other models.

## 🌐 Deployment Checklist

Before deploying to production:

- [ ] Backend README reviewed
- [ ] DEPLOYMENT.md guide read
- [ ] Environment variables prepared
- [ ] MongoDB Atlas cluster created
- [ ] Email configured (Gmail App Password)
- [ ] JWT secret generated
- [ ] Frontend build tested locally
- [ ] API endpoints tested
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] Logging enabled

## 📞 Support

### Common Issues

**Port already in use?**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Reset database:**
Delete collections in MongoDB Atlas console and restart the app.

## 🚀 Next Steps

1. ✅ Get it running locally
2. ✅ Test all features
3. ✅ Add your portfolio content
4. ✅ Customize styling
5. ✅ Deploy to production
6. ✅ Setup domain
7. ✅ Monitor performance

## 📄 License

ISC License - feel free to use this template for your portfolio!

## 🙌 Credits

Built with:
- React + Tailwind CSS
- Express + MongoDB
- JWT Authentication
- Nodemailer

---

**Happy coding! 🎉**

For detailed API documentation, see [Server/README.md](./Server/README.md)

For deployment instructions, see [Server/DEPLOYMENT.md](./Server/DEPLOYMENT.md)
