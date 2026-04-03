# Portfolio Backend - MERN Stack

A complete, production-ready backend for a portfolio website built with **MongoDB, Express.js, Node.js**.

## 📋 Features

✅ **Authentication & Authorization**
- JWT-based admin authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control

✅ **Contact Form API**
- Receive and store contact messages
- Email notifications (admin + user confirmation)
- Input validation and sanitization
- Rate limiting to prevent spam

✅ **Projects Management**
- Full CRUD operations for portfolio projects
- Featured projects filtering
- Tech stack tracking
- Image URLs and live/GitHub links

✅ **Skills Management**
- Organize skills by categories
- Proficiency levels and years of experience
- Easy skill updates

✅ **Experience Management**
- Display work experience and current role
- Timeline organization
- Technology tags

✅ **Case Studies**
- Showcase project case studies
- Problem-solution-results structure
- Related technologies and links

✅ **Security**
- Helmet for HTTP headers security
- XSS protection
- Rate limiting
- CORS configuration
- Input validation and sanitization

✅ **Logging**
- Morgan request logging
- Custom application logging
- Error tracking and monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
cd Server
npm install
```

2. **Setup Environment Variables**

```bash
cp .env.example .env
```

Fill in your `.env` file with:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourportfolio.com
CONTACT_EMAIL=your_email@gmail.com

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**📧 Email Setup (Gmail):**

1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `EMAIL_PASSWORD`

3. **Start Development Server**

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
Server/
├── src/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── models/
│   │   ├── User.js               # Admin user model
│   │   ├── Project.js            # Projects model
│   │   ├── Contact.js            # Contact messages model
│   │   ├── Skill.js              # Skills model
│   │   ├── Experience.js         # Experience model
│   │   └── CaseStudy.js          # Case studies model
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── projectController.js  # Projects CRUD
│   │   ├── contactController.js  # Contact form handling
│   │   ├── skillController.js    # Skills CRUD
│   │   ├── experienceController.js # Experience CRUD
│   │   └── caseStudyController.js # Case studies CRUD
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── projectRoutes.js      # Projects endpoints
│   │   ├── contactRoutes.js      # Contact endpoints
│   │   ├── skillRoutes.js        # Skills endpoints
│   │   ├── experienceRoutes.js   # Experience endpoints
│   │   └── caseStudyRoutes.js    # Case studies endpoints
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Error handling
│   │   └── validateInput.js      # Input validation
│   ├── utils/
│   │   ├── logger.js             # Application logging
│   │   └── emailService.js       # Email sending
│   └── server.js                 # Express app entry point
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Admin login | ❌ |
| POST | `/api/auth/register` | Register admin (first-time only) | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| PUT | `/api/auth/change-password` | Change password | ✅ |

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | Get all projects | ❌ |
| GET | `/api/projects/featured` | Get featured projects | ❌ |
| GET | `/api/projects/:id` | Get single project | ❌ |
| POST | `/api/projects` | Create project | ✅ |
| PUT | `/api/projects/:id` | Update project | ✅ |
| DELETE | `/api/projects/:id` | Delete project | ✅ |
| POST | `/api/projects/bulk` | Bulk create projects | ✅ |

### Contact

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Submit contact form | ❌ |
| GET | `/api/contact` | Get all messages | ✅ |
| GET | `/api/contact/stats` | Get message statistics | ✅ |
| GET | `/api/contact/:id` | Get single message | ✅ |
| PUT | `/api/contact/:id/read` | Mark as read | ✅ |
| PUT | `/api/contact/:id/replied` | Mark as replied | ✅ |
| DELETE | `/api/contact/:id` | Delete message | ✅ |

### Skills

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/skills` | Get all skills | ❌ |
| GET | `/api/skills/:id` | Get skill category | ❌ |
| POST | `/api/skills` | Create skill category | ✅ |
| PUT | `/api/skills/:id` | Update skill category | ✅ |
| DELETE | `/api/skills/:id` | Delete skill category | ✅ |
| POST | `/api/skills/:id/skills` | Add skill to category | ✅ |
| DELETE | `/api/skills/:id/skills/:skillId` | Remove skill | ✅ |

### Experience

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/experience` | Get all experience | ❌ |
| GET | `/api/experience/:id` | Get single experience | ❌ |
| GET | `/api/experience/current` | Get current role | ❌ |
| POST | `/api/experience` | Create experience | ✅ |
| PUT | `/api/experience/:id` | Update experience | ✅ |
| DELETE | `/api/experience/:id` | Delete experience | ✅ |

### Case Studies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/case-studies` | Get all case studies | ❌ |
| GET | `/api/case-studies/:id` | Get single case study | ❌ |
| POST | `/api/case-studies` | Create case study | ✅ |
| PUT | `/api/case-studies/:id` | Update case study | ✅ |
| DELETE | `/api/case-studies/:id` | Delete case study | ✅ |

## 📚 API Usage Examples

### Register/Login

**Register (First Admin)**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@yourportfolio.com",
  "password": "securepassword123"
}
```

**Login**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@yourportfolio.com",
  "password": "securepassword123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64f1d2e3a4b5c6d7e8f9",
    "name": "Admin User",
    "email": "admin@yourportfolio.com",
    "role": "admin"
  }
}
```

### Create Project

```bash
POST /api/projects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "description": "A full-stack e-commerce platform built with MERN stack...",
  "techStack": ["React", "Node.js", "MongoDB", "Express", "Stripe"],
  "imageUrl": "https://example.com/project-image.jpg",
  "imageAlt": "E-commerce Platform",
  "githubLink": "https://github.com/yourusername/ecommerce",
  "liveLink": "https://ecommerce-demo.com",
  "featured": true,
  "order": 1
}
```

### Submit Contact Form

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "subject": "Project Inquiry",
  "message": "Hi! I'd like to discuss a project opportunity..."
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation
- **nodemailer** - Email sending
- **morgan** - Request logging
- **xss-clean** - XSS protection

## 🧪 Testing Endpoints

Use Postman, Thunderclient, or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all projects
curl http://localhost:5000/api/projects

# Get all skills
curl http://localhost:5000/api/skills
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- Render
- Railway
- Cyclic
- Heroku

## 📝 Environment Variables Reference

```env
# Database
MONGODB_URI                  # MongoDB connection string

# Authentication
JWT_SECRET                   # Secret key for JWT tokens
JWT_EXPIRE                   # Token expiration time (e.g., 7d)

# Email
EMAIL_SERVICE               # Email service (gmail, outlook, etc.)
EMAIL_USER                  # Email address
EMAIL_PASSWORD              # Email password or app password
EMAIL_FROM                  # From address for emails
CONTACT_EMAIL              # Email to receive contact form submissions

# Server
PORT                       # Server port (default: 5000)
NODE_ENV                   # Environment (development/production)
FRONTEND_URL              # Frontend URL for CORS

# Admin Credentials (for initial setup)
ADMIN_EMAIL                # Admin email
ADMIN_PASSWORD             # Admin password
```

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing (10 salt rounds)
- Never stored in plaintext

✅ **API Security**
- Helmet HTTP headers
- CORS configuration
- Rate limiting (100 requests per 15 min)
- Contact form rate limiting (5 per hour)
- XSS protection

✅ **Input Validation**
- Express-validator middleware
- Database validation via Mongoose schemas
- Email format validation
- URL validation

✅ **Error Handling**
- Centralized error handler
- Detailed error messages in development
- Generic messages in production
- Proper HTTP status codes

## 🐛 Troubleshooting

**"MONGODB_URI is not defined"**
- Create `.env` file in Server directory
- Copy from `.env.example` and fill in values

**"Email service connection failed"**
- Check EMAIL_USER and EMAIL_PASSWORD
- Ensure 2FA and App Password setup for Gmail
- Check firewall/network settings

**"Port already in use"**
- Change PORT in `.env` to a different value
- Or kill process using port: `lsof -ti:5000 | xargs kill -9`

## 📖 Additional Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [JWT Authentication](https://jwt.io/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Express.js Guide](https://expressjs.com/)

## 📄 License

This project is open source and available under the ISC License.

## 🤝 Support

For issues or questions, please create an issue in the repository or contact the maintainer.

---

**Happy Coding! 🚀**
