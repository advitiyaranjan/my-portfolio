import serverless from 'serverless-http';
import app, { initializeApp } from '../Server/src/server.js';

const handler = serverless(app);

export default async function vercelApiHandler(req, res) {
  await initializeApp();
  return handler(req, res);
}