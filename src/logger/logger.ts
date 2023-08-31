import { combineTableNames } from 'sequelize/types/utils';
import winston from 'winston';

const myFormat = winston.format.printf(info => {
  return (info.message);
})

export const logger = winston.createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'info' : 'error',
  format: winston.format.combine(winston.format.json(), myFormat),
  defaultMeta: { application: 'insurance-app' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
