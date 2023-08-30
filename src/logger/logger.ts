import winston from 'winston';
export const logger = winston.createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'info' : 'error',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
