import express, { Response, Router, NextFunction } from 'express';
import { verifyToken } from "../middlewares/auth";
import { logger } from '../logger/logger';
import { GenerateQuote, RetrieveUserQuotes } from "../controllers/userquotes.controller"

const router: Router = express.Router();

router.post('/generatequote', async (req: any, res: Response, next: NextFunction) => {
  try {
    var dateOfBirth = new Date(req.body.DateOfBirth);
    const userQuote = await GenerateQuote(dateOfBirth, req.body.SmokerStatus, req.body.Weight, req.body.CoveragePeriod,
      req.body.State, req.user?.user_id, req.body.Feet, req.body.Inches, req.body.CoverageAmount,
      req.body.Gender);
    logger.info(`User Quote Created Successfully QuoteID:${userQuote.dataValues.QuoteID} and PremiumAmount: ${userQuote.dataValues.PremiumAmount}`);
    res.send({ "QuoteID": userQuote.dataValues.QuoteID, "PremiumAmount": userQuote.dataValues.PremiumAmount });
  }
  catch (ex: any) {
    logger.error(ex, { service: 'user-quote' });
    if (ex.name === "SequelizeValidationError") {
      res.status(400).send(ex);
    }
    else {
      res.status(500).send(ex.message);
    }
  }
});

router.get('/retrieveuserquotes', verifyToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    var userQuotes = await RetrieveUserQuotes(req.user.user_id);
    logger.info(`User Quote retrieved Successfully UserID:${req.user.user_id}`);
    res.send(userQuotes);
  }
  catch (ex: any) {
    logger.error(ex, { service: 'user-quote' });
    if (ex.name === "SequelizeValidationError") {
      res.status(400).send(ex);
    }
    else {
      res.status(500).send(ex.message);
    }
  }
});

export const userQuoteRouter: Router = router;