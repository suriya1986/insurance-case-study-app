import express from 'express';
import { versionOneRouter } from './routes/v1/routes';
import { config } from './config';
var bodyParser = require('body-parser')
import { sequelizesync } from './models/sequelize';
import { logger } from './logger/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../src/swagger.json';
import winston from 'winston';

(async () => {
  try {
      await sequelizesync();
  } catch (e) {
    logger.error(e);
  }
})();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/v1",versionOneRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.listen(config.PORT, config.HOST, () => {
  logger.info(`Server started on port http://${config.HOST}:${config.PORT}`);
});

