/**
 * Local Development Server
 * Simulates Vercel Serverless Functions for local development
 * Combines frontend and API on the same dev server
 */

import 'dotenv/config.js';
import express from 'express';
import handler from './api/handler.js';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes - Pass all /api requests to the serverless handler
app.all('/api/*', async (req, res) => {
  // Convert Express request/response to match serverless format
  req.url = req.path;
  req.headers.host = req.get('host') || 'localhost:5000';
  await handler(req, res);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API Server Running' });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API Server', docs: 'See /api/skills, /api/projects, etc.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ Portfolio API Server running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health\n`);
});

export default app;
