const redis = require('../config/redisClient');

const MAX_LOGS = 100; // keep only last 100 logs

const logResponse = async (type, message, req = null, error = null) => {
  const log = {
    type,
    message,
    route: req?.originalUrl || null,
    method: req?.method || null,
    time: new Date().toISOString()
  };

  if (type === 'error' && error) {
    log.stack = error.stack?.split('\n'); // cleaner stack
  }

  await redis.lPush('response_logs', JSON.stringify(log));
  await redis.lTrim('response_logs', 0, MAX_LOGS - 1);
};

const logError = async (error, req = null) => {
  await logResponse('error', error.message, req, error);
};

const logSuccess = async (message, req = null) => {
  await logResponse('success', message, req);
};

module.exports = { logError, logSuccess };