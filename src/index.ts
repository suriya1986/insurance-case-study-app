import express from 'express';
import { usersRouter } from './routes/Users';
import { userQuoteRouter } from './routes/UserQuote';
import { policyRouter } from './routes/PolicyApplication';
import { config } from './config';
var bodyParser = require('body-parser')
import { sequelizesync } from './models/sequelize';
import { logger } from './logger/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../src/swagger.json';
import winston from 'winston';

//sequelizesync();
(async () => {
  try {
      await sequelizesync();
  } catch (e) {
      // Deal with the fact the chain failed
  }
  // `text` is not available here
})();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/user", usersRouter);
app.use("/userquote", userQuoteRouter);
app.use("/policy", policyRouter);

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

