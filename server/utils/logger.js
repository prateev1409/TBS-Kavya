const winston = require('winston');

// Configure the logger
const logger = winston.createLogger({
    level: 'info', // Log info level and above (info, warn, error)
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Log to console
        new winston.transports.Console(),
        // Log to a file
        new winston.transports.File({ filename: 'logs/app.log' }),
        // Log errors to a separate file
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});

module.exports = logger;