const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname,"../logs", 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname,"../logs", 'combined.log') }),
  ],
});

// Usage
// logger.info('This is an info log');
// logger.error('This is an error log');

module.exports = logger;
