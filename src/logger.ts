import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Use JSON format for structured logging
  ),
  transports: [
    new winston.transports.Console(), // Log to console
  ],
});

export default logger;
