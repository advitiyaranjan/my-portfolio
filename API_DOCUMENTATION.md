# API Documentation

Complete reference for all portfolio backend API endpoints.

## Base URL

**Development:** `http://localhost:5000/api`

**Production:** `https://your-domain.onrender.com/api`

## Authentication

### JWT Token

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

To get a token:

1. Register: `POST /auth/register`
2. Login: `POST /auth/login`
3. Store token from response
4. Send in all future requests

---

## 🔐 Authentication Endpoints

### Register Admin

Create a new admin account (first-time only).

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Admin registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "name": "Your Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### Login

Authenticate admin account.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "name": "Your Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Get Current User

Retrieve authenticated admin profile.

```http
GET /auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "name": "Your Name",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

---

### Update Profile

Update admin name and email.

```http
PUT /auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "name": "Updated Name",
    "email": "newemail@example.com",
    "role": "admin"
  }
}
```

---

### Change Password

Change admin password.

```http
PUT /auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📦 Projects Endpoints

### Get All Projects

Retrieve all portfolio projects.

```http
GET /projects
```

**Query Parameters:**

- None (but can add pagination in future)

**Success Response (200):**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
      "title": "E-commerce Platform",
      "description": "Full-stack e-commerce with MERN...",
      "techStack": ["React", "Node.js", "MongoDB", "Express"],
      "imageUrl": "https://example.com/project.jpg",
      "imageAlt": "E-commerce Platform",
      "githubLink": "https://github.com/user/project",
      "liveLink": "https://project-demo.com",
      "featured": true,
      "order": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Featured Projects

Retrieve only featured projects.

```http
GET /projects/featured
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
      "title": "E-commerce Platform",
      "description": "Full-stack e-commerce...",
      "techStack": ["React", "Node.js", "MongoDB"],
      "featured": true,
      "order": 1
    }
  ]
}
```

---

### Get Single Project

Retrieve a specific project by ID.

```http
GET /projects/64f1d2e3a4b5c6d7e8f9g0h1
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "E-commerce Platform",
    "description": "Full-stack e-commerce with MERN...",
    "techStack": ["React", "Node.js", "MongoDB", "Express"],
    "imageUrl": "https://example.com/project.jpg",
    "githubLink": "https://github.com/user/project",
    "liveLink": "https://project-demo.com"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Project not found"
}
```

---

### Create Project

Create a new portfolio project (admin only).

```http
POST /projects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Mobile App",
  "description": "Cross-platform mobile app built with React Native...",
  "techStack": ["React Native", "Firebase", "Redux"],
  "imageUrl": "https://example.com/app.jpg",
  "imageAlt": "Mobile App Screenshot",
  "githubLink": "https://github.com/user/mobile-app",
  "liveLink": "https://play.google.com/store/apps/details?id=com.example",
  "featured": true,
  "order": 2
}
```

**Required Fields:**
- `title` (string, 3-100 chars)
- `description` (string, 10-2000 chars)
- `techStack` (array, min 1 item)
- `imageUrl` (valid URL)

**Optional Fields:**
- `imageAlt` (string)
- `githubLink` (valid GitHub URL)
- `liveLink` (valid URL)
- `featured` (boolean)
- `order` (number)

**Success Response (201):**

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "Mobile App",
    "description": "Cross-platform mobile app...",
    "techStack": ["React Native", "Firebase", "Redux"],
    "featured": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Project

Update an existing project (admin only).

```http
PUT /projects/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated Mobile App",
  "description": "Updated description...",
  "featured": false,
  "order": 3
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "Updated Mobile App",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

---

### Delete Project

Delete a project (admin only).

```http
DELETE /projects/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### Bulk Create Projects

Create multiple projects at once (admin only).

```http
POST /projects/bulk
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "projects": [
    {
      "title": "Project 1",
      "description": "Description 1...",
      "techStack": ["React", "Node.js"],
      "imageUrl": "https://example.com/1.jpg"
    },
    {
      "title": "Project 2",
      "description": "Description 2...",
      "techStack": ["Vue", "Django"],
      "imageUrl": "https://example.com/2.jpg"
    }
  ]
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "2 projects created successfully",
  "data": [...]
}
```

---

## 💬 Contact Endpoints

### Submit Contact Form

Submit a contact form message (public).

```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "subject": "Project Inquiry",
  "message": "Hi! I'm interested in discussing a project opportunity..."
}
```

**Required Fields:**
- `name` (string, 2-50 chars)
- `email` (valid email)
- `message` (string, 10-5000 chars)

**Optional Fields:**
- `phone` (valid phone format)
- `subject` (string, max 100 chars)

**Success Response (201):**

```json
{
  "success": true,
  "message": "Message received! We will get back to you soon.",
  "data": {
    "id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Note:** Both admin and user receive email notifications.

---

### Get All Messages

Retrieve all contact messages (admin only).

```http
GET /contact
Authorization: Bearer YOUR_JWT_TOKEN

Query Parameters:
?page=1&limit=10&isRead=false&isReplied=false
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900",
      "subject": "Project Inquiry",
      "message": "Hi! I'm interested...",
      "isRead": false,
      "isReplied": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Message Statistics

Get contact form statistics (admin only).

```http
GET /contact/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalMessages": 45,
    "unreadMessages": 12,
    "repliedMessages": 30,
    "unrepliedMessages": 15
  }
}
```

---

### Get Single Message

Retrieve a specific contact message (admin only).

```http
GET /contact/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Full message...",
    "isRead": true
  }
}
```

---

### Mark Message as Read

Mark a contact message as read (admin only).

```http
PUT /contact/64f1d2e3a4b5c6d7e8f9g0h1/read
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Message marked as read",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "isRead": true
  }
}
```

---

### Mark Message as Replied

Mark a contact message as replied (admin only).

```http
PUT /contact/64f1d2e3a4b5c6d7e8f9g0h1/replied
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Message marked as replied",
  "data": {
    "isReplied": true
  }
}
```

---

### Delete Message

Delete a contact message (admin only).

```http
DELETE /contact/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## 🛠️ Skills Endpoints

### Get All Skills

Retrieve all skill categories.

```http
GET /skills
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
      "category": "Frontend",
      "skills": [
        {
          "_id": "64f1d2e3a4b5c6d7e8f9g0h2",
          "name": "React",
          "proficiency": "expert",
          "yearsOfExperience": 3
        }
      ],
      "order": 1
    }
  ]
}
```

---

### Get Single Skill Category

Retrieve a specific skill category.

```http
GET /skills/64f1d2e3a4b5c6d7e8f9g0h1
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "category": "Frontend",
    "skills": [
      {
        "_id": "64f1d2e3a4b5c6d7e8f9g0h2",
        "name": "React",
        "proficiency": "expert",
        "yearsOfExperience": 3
      }
    ]
  }
}
```

---

### Create Skill Category

Create a new skill category (admin only).

```http
POST /skills
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "category": "Backend",
  "skills": [
    {
      "name": "Node.js",
      "proficiency": "expert",
      "yearsOfExperience": 4
    },
    {
      "name": "Python",
      "proficiency": "intermediate",
      "yearsOfExperience": 2
    }
  ],
  "order": 2
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Skill category created successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "category": "Backend",
    "skills": [...]
  }
}
```

---

### Update Skill Category

Update a skill category (admin only).

```http
PUT /skills/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "category": "Backend & APIs",
  "order": 3
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Skill category updated successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "category": "Backend & APIs"
  }
}
```

---

### Delete Skill Category

Delete a skill category (admin only).

```http
DELETE /skills/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Skill category deleted successfully"
}
```

---

### Add Skill to Category

Add an individual skill to a category (admin only).

```http
POST /skills/64f1d2e3a4b5c6d7e8f9g0h1/skills
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "TypeScript",
  "proficiency": "advanced",
  "yearsOfExperience": 2
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Skill added successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "skills": [...]
  }
}
```

---

### Remove Skill from Category

Remove a skill from a category (admin only).

```http
DELETE /skills/64f1d2e3a4b5c6d7e8f9g0h1/skills/64f1d2e3a4b5c6d7e8f9g0h2
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Skill removed successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "skills": [...]
  }
}
```

---

## 💼 Experience Endpoints

### Get All Experience

Retrieve all work experience.

```http
GET /experience
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
      "title": "Senior Developer",
      "company": "Tech Company",
      "location": "San Francisco, CA",
      "description": "Led development of...",
      "startDate": "2022-01-15T00:00:00Z",
      "endDate": "2024-01-15T00:00:00Z",
      "isCurrentRole": false,
      "technologies": ["React", "Node.js", "MongoDB"],
      "order": 1
    }
  ]
}
```

---

### Get Current Role

Retrieve the current/active role.

```http
GET /experience/current
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "Lead Developer",
    "company": "Current Company",
    "isCurrentRole": true,
    "startDate": "2024-01-01T00:00:00Z"
  }
}
```

---

### Create Experience

Add work experience (admin only).

```http
POST /experience
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Full Stack Developer",
  "company": "Digital Agency",
  "location": "New York, NY",
  "description": "Developed and maintained multiple client projects...",
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2024-01-01T00:00:00Z",
  "isCurrentRole": false,
  "technologies": ["React", "Express", "PostgreSQL"],
  "order": 2
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Experience created successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "Full Stack Developer",
    "company": "Digital Agency"
  }
}
```

---

### Update Experience

Update work experience (admin only).

```http
PUT /experience/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Senior Full Stack Developer",
  "description": "Updated responsibilities...",
  "isCurrentRole": true
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Experience updated successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "Senior Full Stack Developer"
  }
}
```

---

### Delete Experience

Delete work experience (admin only).

```http
DELETE /experience/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Experience deleted successfully"
}
```

---

## 📰 Case Studies Endpoints

### Get All Case Studies

Retrieve all case studies.

```http
GET /case-studies
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
      "title": "E-commerce Platform Optimization",
      "description": "How we improved performance...",
      "imageUrl": "https://example.com/case1.jpg",
      "challenge": "Site was loading slowly...",
      "solution": "Implemented caching and CDN...",
      "results": "50% faster load times...",
      "technologies": ["React", "Node.js", "Redis"],
      "link": "https://project-demo.com",
      "order": 1
    }
  ]
}
```

---

### Get Single Case Study

Retrieve a specific case study.

```http
GET /case-studies/64f1d2e3a4b5c6d7e8f9g0h1
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "E-commerce Platform Optimization",
    "description": "Full case study...",
    "challenge": "...",
    "solution": "...",
    "results": "..."
  }
}
```

---

### Create Case Study

Create a new case study (admin only).

```http
POST /case-studies
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Mobile App Launch",
  "description": "Successful launch of cross-platform app...",
  "imageUrl": "https://example.com/app.jpg",
  "challenge": "Needed to support iOS and Android...",
  "solution": "Used React Native for shared codebase...",
  "results": "Launched on both app stores...",
  "technologies": ["React Native", "Firebase"],
  "link": "https://play.google.com/store/apps/details?id=com.example",
  "order": 2
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Case study created successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "Mobile App Launch"
  }
}
```

---

### Update Case Study

Update a case study (admin only).

```http
PUT /case-studies/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "results": "New results data..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Case study updated successfully",
  "data": {
    "_id": "64f1d2e3a4b5c6d7e8f9g0h1",
    "title": "Updated Title"
  }
}
```

---

### Delete Case Study

Delete a case study (admin only).

```http
DELETE /case-studies/64f1d2e3a4b5c6d7e8f9g0h1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Case study deleted successfully"
}
```

---

## Health Check

```http
GET /health
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Responses

### Bad Request (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "No token provided. Authorization required."
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Project not found"
}
```

### Conflict (409) - Duplicate

```json
{
  "success": false,
  "message": "email already exists"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

- **General APIs:** 100 requests per 15 minutes per IP
- **Contact Form:** 5 submissions per hour per IP
- **Returns:** `429 Too Many Requests` when limit exceeded

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Testing with cURL

### Get All Projects
```bash
curl http://localhost:5000/api/projects
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Create Project (with token)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Project","description":"Desc","techStack":["React"],"imageUrl":"url"}'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Hello!"}'
```

---

**For integration examples, see [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md)**
