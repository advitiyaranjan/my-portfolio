import 'dotenv/config.js';
import { usersStorage, skillsStorage, projectsStorage, experiencesStorage, achievementsStorage, contactStorage, portFolioStorage, caseStudiesStorage } from './lib/storage.js';
import { extractToken, verifyToken, hashPassword, comparePassword, generateToken, validateEmail } from './lib/auth.js';
import seedData from './seed.js';

const bootstrapDataPromise = seedData().catch((error) => {
  console.error('❌ Failed to seed initial data:', error);
});

// Validate JWT_SECRET on startup - this will throw if auth.js cannot initialize
if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is missing!');
  console.error('To fix:');
  console.error('  Local: Create/.env file with: JWT_SECRET=your_secret_key');
  console.error('  Vercel: Run: vercel env add JWT_SECRET');
  // Don't exit - let requests fail gracefully with meaningful errors
}

// CORS helper
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
};

// Auth middleware
const requireAuth = (req) => {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded;
};

// Extract ID from URL
const getIdFromUrl = (pathname, baseRoute) => {
  const parts = pathname.split('/');
  const baseIndex = parts.findIndex(p => p === baseRoute.split('/')[2]);
  return parts[baseIndex + 1];
};

const getActionFromUrl = (pathname, baseRoute) => {
  const parts = pathname.split('/');
  const baseIndex = parts.findIndex(p => p === baseRoute.split('/')[2]);
  return parts[baseIndex + 2] || null;
};

// Skills API
export async function handleSkills(req, res, pathname) {
  setCorsHeaders(res);
  const id = getIdFromUrl(pathname, '/api/skills');

  if (id && req.method === 'GET') {
    const skill = await skillsStorage.findById(id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    return res.status(200).json({ success: true, data: skill });
  }

  if (id && req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const updated = await skillsStorage.updateById(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Skill not found' });
    return res.status(200).json({ success: true, message: 'Skill updated', data: updated });
  }

  if (id && req.method === 'DELETE') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const deleted = await skillsStorage.deleteById(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Skill not found' });
    return res.status(200).json({ success: true, message: 'Skill deleted' });
  }

  if (req.method === 'GET') {
    const skills = await skillsStorage.findAll();
    const sorted = skillsStorage.sort(skills, 'order', 1);
    return res.status(200).json({ success: true, data: sorted, count: sorted.length });
  }

  if (req.method === 'POST') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { category, skills: skillsList, order } = req.body;
    if (!category || !skillsList) {
      return res.status(400).json({ success: false, message: 'Category and skills required' });
    }

    const newSkill = await skillsStorage.create({ category, skills: skillsList, order: order || 0 });
    return res.status(201).json({ success: true, message: 'Skill created', data: newSkill });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// Projects API
export async function handleProjects(req, res, pathname) {
  setCorsHeaders(res);
  const id = getIdFromUrl(pathname, '/api/projects');

  if (id && req.method === 'GET') {
    const project = await projectsStorage.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.status(200).json({ success: true, data: project });
  }

  if (id && req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const updated = await projectsStorage.updateById(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.status(200).json({ success: true, message: 'Project updated', data: updated });
  }

  if (id && req.method === 'DELETE') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const deleted = await projectsStorage.deleteById(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.status(200).json({ success: true, message: 'Project deleted' });
  }

  if (req.method === 'GET') {
    const projects = await projectsStorage.findAll();
    const sorted = projectsStorage.sort(projects, 'order', 1);
    return res.status(200).json({ success: true, data: sorted, count: sorted.length });
  }

  if (req.method === 'POST') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { title, description, techStack, imageUrl, githubLink, liveLink } = req.body;
    if (!title || !description || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newProject = await projectsStorage.create({
      title, description, techStack, imageUrl, githubLink, liveLink, order: 0
    });
    return res.status(201).json({ success: true, message: 'Project created', data: newProject });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// Experience API
export async function handleExperience(req, res, pathname) {
  setCorsHeaders(res);
  const id = getIdFromUrl(pathname, '/api/experience');

  if (id && req.method === 'GET') {
    const experience = await experiencesStorage.findById(id);
    if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
    return res.status(200).json({ success: true, data: experience });
  }

  if (id && req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const updated = await experiencesStorage.updateById(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Experience not found' });
    return res.status(200).json({ success: true, message: 'Experience updated', data: updated });
  }

  if (id && req.method === 'DELETE') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const deleted = await experiencesStorage.deleteById(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Experience not found' });
    return res.status(200).json({ success: true, message: 'Experience deleted' });
  }

  if (req.method === 'GET') {
    const experiences = await experiencesStorage.findAll();
    const sorted = experiencesStorage.sort(experiences, 'startDate', -1);
    return res.status(200).json({ success: true, data: sorted, count: sorted.length });
  }

  if (req.method === 'POST') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { title, company, location, description, startDate, endDate, isCurrentRole } = req.body;
    if (!title || !company || !startDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newExperience = await experiencesStorage.create({
      title, company, location, description, startDate, endDate, isCurrentRole
    });
    return res.status(201).json({ success: true, message: 'Experience created', data: newExperience });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// Achievements API
export async function handleAchievements(req, res, pathname) {
  setCorsHeaders(res);
  const id = getIdFromUrl(pathname, '/api/achievements');

  if (id && req.method === 'GET') {
    const achievement = await achievementsStorage.findById(id);
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });
    return res.status(200).json({ success: true, data: achievement });
  }

  if (id && req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const updated = await achievementsStorage.updateById(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Achievement not found' });
    return res.status(200).json({ success: true, message: 'Achievement updated', data: updated });
  }

  if (id && req.method === 'DELETE') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const deleted = await achievementsStorage.deleteById(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Achievement not found' });
    return res.status(200).json({ success: true, message: 'Achievement deleted' });
  }

  if (req.method === 'GET') {
    const achievements = await achievementsStorage.findAll();
    const sorted = achievementsStorage.sort(achievements, 'order', 1);
    return res.status(200).json({ success: true, data: sorted, count: sorted.length });
  }

  if (req.method === 'POST') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { icon, title, subtitle, description, details, gradient, color, order } = req.body;
    if (!icon || !title || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newAchievement = await achievementsStorage.create({
      icon, title, subtitle, description, details, gradient, color, order: order || 0
    });
    return res.status(201).json({ success: true, message: 'Achievement created', data: newAchievement });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// Portfolio API
export async function handlePortfolio(req, res, pathname) {
  setCorsHeaders(res);
  const id = getIdFromUrl(pathname, '/api/portfolio');

  if (pathname === '/api/portfolio/stats' && req.method === 'GET') {
    const portfolio = (await portFolioStorage.findAll())[0] || null;
    const projects = (await projectsStorage.findAll()).length;
    const skills = (await skillsStorage.findAll()).length;
    const experiences = (await experiencesStorage.findAll()).length;

    return res.status(200).json({
      success: true,
      data: {
        projects,
        skills,
        experiences,
        viewCount: portfolio?.viewCount || 0,
        lastUpdated: portfolio?.lastUpdated || portfolio?.updatedAt || portfolio?.createdAt || null,
        updatedAt: portfolio?.updatedAt || null,
      },
    });
  }

  if (pathname === '/api/portfolio/view' && req.method === 'POST') {
    const portfolios = await portFolioStorage.findAll();
    let portfolio = portfolios[0];

    if (!portfolio) {
      portfolio = await portFolioStorage.create({
        viewCount: 1,
        lastUpdated: new Date().toISOString(),
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
      });
    } else {
      portfolio = await portFolioStorage.updateById(portfolio._id, {
        viewCount: Number(portfolio.viewCount || 0) + 1,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Portfolio view tracked',
      data: { viewCount: portfolio?.viewCount || 0 },
    });
  }

  if (id && id !== 'stats' && req.method === 'GET') {
    const portfolio = await portFolioStorage.findById(id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    return res.status(200).json({ success: true, data: portfolio });
  }

  if (req.method === 'GET') {
    const portfolios = await portFolioStorage.findAll();
    if (portfolios.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          _id: 'default',
          viewCount: 0,
          socialLinks: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        }
      });
    }
    return res.status(200).json({ success: true, data: portfolios[0] });
  }

  if (req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const portfolios = await portFolioStorage.findAll();
    let portfolio = portfolios[0];
    const lastUpdated = new Date().toISOString();
    if (!portfolio) {
      portfolio = await portFolioStorage.create({
        ...req.body,
        viewCount: Number(req.body?.viewCount || 0),
        lastUpdated,
      });
    } else {
      portfolio = await portFolioStorage.updateById(portfolio._id, {
        ...req.body,
        lastUpdated,
      });
    }
    return res.status(200).json({ success: true, message: 'Portfolio updated', data: portfolio });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// Auth API
export async function handleAuth(req, res, path) {
  setCorsHeaders(res);

  if (path === '/api/auth/login' && req.method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await usersStorage.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.email);
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword, token }
    });
  }

  if (path === '/api/auth/register' && req.method === 'POST') {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, password required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    if (await usersStorage.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await usersStorage.create({ name, email, password: hashedPassword, role: 'admin' });
    const token = generateToken(newUser._id, newUser.email);
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user: userWithoutPassword, token }
    });
  }

  if (path === '/api/auth/me' && req.method === 'GET') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const userData = await usersStorage.findById(user.userId);
    if (!userData) return res.status(404).json({ success: false, message: 'User not found' });

    const { password: _, ...userWithoutPassword } = userData;
    return res.status(200).json({ success: true, data: userWithoutPassword });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// Contact API
export async function handleContact(req, res, pathname) {
  setCorsHeaders(res);
  const id = getIdFromUrl(pathname, '/api/contact');
  const action = getActionFromUrl(pathname, '/api/contact');

  if (pathname === '/api/contact/stats' && req.method === 'GET') {
    const messages = await contactStorage.findAll();
    const unreadCount = messages.filter((message) => !(message.isRead ?? message.read)).length;
    const repliedCount = messages.filter((message) => Boolean(message.repliedAt)).length;

    return res.status(200).json({
      success: true,
      data: {
        total: messages.length,
        unreadCount,
        repliedCount,
      },
    });
  }

  if (id && req.method === 'GET') {
    const contact = await contactStorage.findById(id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    return res.status(200).json({ success: true, data: contact });
  }

  if (id && action === 'read' && req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const updated = await contactStorage.updateById(id, {
      read: true,
      isRead: true,
      readAt: new Date().toISOString(),
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Contact not found' });
    return res.status(200).json({ success: true, message: 'Message marked as read', data: updated });
  }

  if (id && action === 'replied' && req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const updated = await contactStorage.updateById(id, {
      repliedAt: new Date().toISOString(),
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Contact not found' });
    return res.status(200).json({ success: true, message: 'Message marked as replied', data: updated });
  }

  if (id && req.method === 'DELETE') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const deleted = await contactStorage.deleteById(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Contact not found' });
    return res.status(200).json({ success: true, message: 'Message deleted' });
  }

  if (req.method === 'GET') {
    const messages = await contactStorage.findAll();
    const limit = parseInt(req.query?.limit || 10);
    const page = parseInt(req.query?.page || 1);
    const start = (page - 1) * limit;
    const paged = messages.slice(start, start + limit);

    return res.status(200).json({
      success: true,
      data: paged,
      total: messages.length,
      page,
      limit
    });
  }

  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim();
    const normalizedMessage = String(message).trim();
    const normalizedSubject = typeof subject === 'string' && subject.trim()
      ? subject.trim()
      : `Portfolio inquiry from ${normalizedName}`;

    if (!normalizedName || !normalizedEmail || !normalizedMessage) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const contact = await contactStorage.create({
      name: normalizedName,
      email: normalizedEmail,
      subject: normalizedSubject,
      message: normalizedMessage,
      read: false,
      isRead: false
    });
    return res.status(201).json({ success: true, message: 'Message sent', data: contact });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// Case Studies API
export async function handleCaseStudies(req, res, pathname) {
  setCorsHeaders(res);
  const id = getIdFromUrl(pathname, '/api/case-studies');

  if (id && req.method === 'GET') {
    const caseStudy = await caseStudiesStorage.findById(id);
    if (!caseStudy) return res.status(404).json({ success: false, message: 'Case study not found' });
    return res.status(200).json({ success: true, data: caseStudy });
  }

  if (id && req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const updated = await caseStudiesStorage.updateById(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Case study not found' });
    return res.status(200).json({ success: true, message: 'Case study updated', data: updated });
  }

  if (id && req.method === 'DELETE') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const deleted = await caseStudiesStorage.deleteById(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Case study not found' });
    return res.status(200).json({ success: true, message: 'Case study deleted' });
  }

  if (req.method === 'GET') {
    const caseStudies = await caseStudiesStorage.findAll();
    const sorted = caseStudiesStorage.sort(caseStudies, 'order', 1);
    return res.status(200).json({ success: true, data: sorted, count: sorted.length });
  }

  if (req.method === 'POST') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { title, description, challenge, solution, results } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const caseStudy = await caseStudiesStorage.create({
      title, description, challenge, solution, results, order: 0
    });
    return res.status(201).json({ success: true, message: 'Case study created', data: caseStudy });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

export default async function handler(req, res) {
  await bootstrapDataPromise;

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Handle OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(200).json({ ok: true });
  }

  // Route to appropriate handlers
  if (pathname.startsWith('/api/skills')) return handleSkills(req, res, pathname);
  if (pathname.startsWith('/api/projects')) return handleProjects(req, res, pathname);
  if (pathname.startsWith('/api/experience')) return handleExperience(req, res, pathname);
  if (pathname.startsWith('/api/achievements')) return handleAchievements(req, res, pathname);
  if (pathname.startsWith('/api/portfolio')) return handlePortfolio(req, res, pathname);
  if (pathname.startsWith('/api/auth')) return handleAuth(req, res, pathname);
  if (pathname.startsWith('/api/contact')) return handleContact(req, res, pathname);
  if (pathname.startsWith('/api/case-studies')) return handleCaseStudies(req, res, pathname);

  return res.status(404).json({ success: false, message: 'Endpoint not found' });
}
