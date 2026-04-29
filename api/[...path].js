import serverless from 'serverless-http';
import { fileURLToPath } from 'url';
import path from 'path';
import app, { initializeApp } from '../Server/src/server.js';

// Get absolute paths for debugging/reliability
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      console.error('Stack:', err.stack);
      initialized = true;
      initError = err;
    }
  }

  try {
    return await handler(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
}