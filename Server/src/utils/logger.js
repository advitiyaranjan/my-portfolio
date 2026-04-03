import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

const formatLog = (level, message, data = null) => {
  const timestamp = getCurrentTimestamp();
  const logEntry = `[${timestamp}] [${level}] ${message}`;
  return data ? `${logEntry} | ${JSON.stringify(data)}` : logEntry;
};

const writeLog = (level, message, data = null) => {
  const logMessage = formatLog(level, message, data);
  const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

  // Console output
  if (level === 'ERROR') {
    console.error(logMessage);
  } else if (level === 'WARN') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }

  // File output
  fs.appendFileSync(logFile, logMessage + '\n');
};

export const logger = {
  error: (message, data) => writeLog('ERROR', message, data),
  warn: (message, data) => writeLog('WARN', message, data),
  info: (message, data) => writeLog('INFO', message, data),
  debug: (message, data) => writeLog('DEBUG', message, data),
};

export default logger;
