# Frontend-Backend Integration Guide

Complete guide on how to integrate your React frontend with the Node.js/Express backend.

## 📋 Table of Contents

1. [API Setup](#api-setup)
2. [Authentication](#authentication)
3. [Using API in Components](#using-api-in-components)
4. [Error Handling](#error-handling)
5. [Common Patterns](#common-patterns)
6. [Deployment Integration](#deployment-integration)

## API Setup

### Environment Variables

The API client is already configured. Files created:

- `Client/src/utils/api.ts` - API service with all endpoints
- `Client/.env.development` - Development API URL
- `Client/.env.production` - Production API URL

### Development Mode

During development, API calls automatically proxy to `http://localhost:5000`:

```env
# Client/.env.development
VITE_API_URL=http://localhost:5000/api
```

### Production Mode

In production, API calls go to the same domain:

```env
# Client/.env.production
VITE_API_URL=/api
```

## Authentication

### Store Token After Login

```typescript
import { authAPI } from '@/utils/api';

// Login
const response = await authAPI.login(email, password);

// Store token
localStorage.setItem('portfolioToken', response.token);

// Token is automatically sent in all future requests
```

### Get Current User

```typescript
import { authAPI } from '@/utils/api';

const user = await authAPI.getCurrentUser();
console.log(user.user.name);
```

### Logout

```typescript
// Clear token
localStorage.removeItem('portfolioToken');

// Redirect to login
window.location.href = '/admin/login';
```

## Using API in Components

### Example 1: Display Projects

```typescript
import { useEffect, useState } from 'react';
import { projectAPI } from '@/utils/api';

export function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectAPI.getAllProjects();
        setProjects(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map((project) => (
        <div key={project._id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Submit Contact Form

```typescript
import { useState } from 'react';
import { contactAPI } from '@/utils/api';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contactAPI.submitForm(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <p className="text-green-500">Message sent successfully!</p>}
      
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        required
      />
      
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        required
      />
      
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) =>
          setFormData({ ...formData, message: e.target.value })
        }
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### Example 3: Admin - Create Project (Protected)

```typescript
import { useState } from 'react';
import { projectAPI } from '@/utils/api';
import { authAPI } from '@/utils/api';

export function CreateProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [],
    imageUrl: '',
    githubLink: '',
    liveLink: '',
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Verify user is authenticated
      await authAPI.getCurrentUser();
      
      // Create project
      const response = await projectAPI.createProject(formData);
      alert('Project created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        techStack: [],
        imageUrl: '',
        githubLink: '',
        liveLink: '',
        featured: false,
      });
    } catch (err) {
      setError(err.message);
      alert('Failed to create project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      
      <input
        type="text"
        placeholder="Project Title"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        required
      />
      
      <textarea
        placeholder="Project Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
      />
      
      {/* Add more fields as needed */}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
```

### Example 4: Display Skills

```typescript
import { useEffect, useState } from 'react';
import { skillAPI } from '@/utils/api';

export function SkillsDisplay() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillAPI.getAllSkills();
        setSkills(response.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div>
      {skills.map((skillCategory) => (
        <div key={skillCategory._id}>
          <h3>{skillCategory.category}</h3>
          <ul>
            {skillCategory.skills.map((skill) => (
              <li key={skill._id}>
                {skill.name} - {skill.proficiency}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### Example 5: Handle Experience

```typescript
import { useEffect, useState } from 'react';
import { experienceAPI } from '@/utils/api';

export function ExperienceList() {
  const [experience, setExperience] = useState([]);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all experience
        const expResponse = await experienceAPI.getAllExperience();
        setExperience(expResponse.data);

        // Get current role
        try {
          const currentResponse = await experienceAPI.getCurrentRole();
          setCurrentRole(currentResponse.data);
        } catch (error) {
          // Current role might not exist
          console.log('No current role set');
        }
      } catch (error) {
        console.error('Failed to fetch experience:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {currentRole && (
        <div className="current-role">
          <h3>{currentRole.title} at {currentRole.company}</h3>
          <p>Current Role</p>
        </div>
      )}

      <div className="experience-list">
        {experience.map((exp) => (
          <div key={exp._id}>
            <h4>{exp.title}</h4>
            <p>{exp.company}</p>
            <p>
              {new Date(exp.startDate).toLocaleDateString()} -
              {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Error Handling

### Common Error Scenarios

```typescript
import { projectAPI } from '@/utils/api';

async function handleUpdate(projectId, data) {
  try {
    const response = await projectAPI.updateProject(projectId, data);
    console.log('Success:', response.data);
  } catch (error) {
    // Unauthorized - token expired
    if (error.message.includes('401')) {
      localStorage.removeItem('portfolioToken');
      window.location.href = '/admin/login';
    }
    
    // Validation error
    if (error.message.includes('Validation')) {
      console.log('Please check your form data');
    }
    
    // Not found
    if (error.message.includes('404')) {
      console.log('Resource not found');
    }
    
    // Generic error handling
    console.error('Error:', error.message);
  }
}
```

### Custom Hook for API Calls

```typescript
import { useState } from 'react';

export function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

// Usage
const { data: projects, loading, error, execute: fetchProjects } = useApi(projectAPI.getAllProjects);

useEffect(() => {
  fetchProjects();
}, []);
```

## Common Patterns

### Protected Component

```typescript
import { useEffect, useState } from 'react';
import { authAPI } from '@/utils/api';

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        setAuthenticated(true);
      } catch (error) {
        // Not authenticated
        window.location.href = '/admin/login';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null;

  return <div>Admin Content</div>;
}
```

### Refresh on Update

```typescript
import { useEffect, useState } from 'react';
import { projectAPI } from '@/utils/api';

export function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await projectAPI.getAllProjects();
      setProjects(response.data);
    };

    fetchProjects();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await projectAPI.deleteProject(id);
      setRefresh((prev) => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div>
      {projects.map((project) => (
        <div key={project._id}>
          <h3>{project.title}</h3>
          <button onClick={() => handleDelete(project._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Deployment Integration

### Building for Production

```bash
# Frontend build (creates optimized bundle)
cd Client
npm run build

# This creates the 'dist' folder

# Backend automatically serves this in production
# Located at: Server/src/server.js line 130-138
```

### Environment URLs

Development:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

Production (Render/Railway):
- Frontend + Backend: `https://your-domain.onrender.com`
- API: `https://your-domain.onrender.com/api`

### CORS Configuration

Backend automatically allows your frontend URL:

```javascript
// Server/.env
FRONTEND_URL=https://your-domain.onrender.com
```

## Testing API Locally

Use curl to test endpoints:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Get all projects
curl http://localhost:5000/api/projects

# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Use token in request
TOKEN="eyJhbGc..."
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### API Calls Return 404

1. Ensure backend is running: `npm run dev` in Server folder
2. Check CORS: `FRONTEND_URL` in `.env` should match frontend URL
3. Check API endpoint: compare with backend routes

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

Solution:
1. Verify backend is running
2. Check `FRONTEND_URL` in `Server/.env`
3. For development: should be `http://localhost:5173`
4. Restart backend after changing env vars

### Token Expired

```typescript
// Automatically handled by API client
// User redirected to login
```

### API Returns Different Data Format

Check `response.data` or `response` - the API wrapper may return:

```typescript
{
  success: true,
  message: "...",
  data: [...],        // Your actual data
  count: 10
}
```

---

**Need more help?** Check:
- `Server/README.md` for API details
- `Client/src/utils/api.ts` for all available functions
- Browser console for error messages
