const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}`;
  return data ? `${logEntry} | ${JSON.stringify(data)}` : logEntry;
};

const writeLog = (level, message, data = null) => {
  const logMessage = formatLog(level, message, data);

  // Console output only (safe for serverless)
  if (level === 'ERROR') {
    console.error(logMessage);
  } else if (level === 'WARN') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
};

export const logger = {
  error: (message, data) => writeLog('ERROR', message, data),
  warn: (message, data) => writeLog('WARN', message, data),
  info: (message, data) => writeLog('INFO', message, data),
  debug: (message, data) => writeLog('DEBUG', message, data),
};

export default logger;
