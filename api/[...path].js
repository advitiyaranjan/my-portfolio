import serverless from 'serverless-http';
import app, { initializeApp } from '../Server/src/server.js';

const handler = serverless(app);

let initialized = false;
let initError = null;

export default async function vercelApiHandler(req, res) {
  // Initialize only once
  if (!initialized) {
    try {
      await initializeApp();
      initialized = true;
    } catch (err) {
      console.error('App initialization error:', err);
      // Mark as initialized so we don't keep retrying
      initialized = true;
      initError = err;
      // Continue anyway - app should handle requests even if DB/email fails
    }
  }

  try {
    return await handler(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
}