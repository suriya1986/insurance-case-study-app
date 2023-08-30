import express, { Request, Response, Router, NextFunction } from 'express';
import { UserQuote } from '../models/UserQuotesModel';
import { verifyToken } from "../middlewares/auth";
import { logger } from '../logger/logger';

const router: Router = express.Router();

router.post('/generatequote', async (req: any, res: Response, next: NextFunction) => {
  try {
    var birthDate = new Date(req.body.DateOfBirth);
    var basePercent = 1;
    if (req.body.SmokerStatus == "Smoker") {
      basePercent++;
    }
    if (req.body.Weight > 200 && req.body.Weigh < 250) {
      basePercent++;
    }
    else if (req.body.Weight >= 200 && req.body.Weight < 300) {
      basePercent += 2;
    }
    else if (req.body.Weight > 300) {
      basePercent += 3;
    }
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age > 30 && age < 40) {
      basePercent += 1;
    }
    else if (age >= 40 && age < 50) {
      basePercent += 2;
    }
    else if (age >= 50 && age < 60) {
      basePercent += 3;
    }
    else if (age >= 60) {
      basePercent += 5;
    }
    if (req.body.CoveragePeriod > 10 && req.body.CoveragePeriod < 15) {
      basePercent += 1;
    }
    else if (req.body.CoveragePeriod >= 15 && req.body.CoveragePeriod < 20) {
      basePercent += 2;
    }
    else if (req.body.CoveragePeriod >= 20 && req.body.CoveragePeriod < 25) {
      basePercent += 3;
    }
    else if (req.body.CoveragePeriod >= 25 && req.body.CoveragePeriod < 30) {
      basePercent += 3;
    }
    const userQuote = await UserQuote.create({
      State: req.body.State,
      UserId: (req.user && req.user.user_id) ? req.user.user_id : null,
      DateOfBirth: birthDate,
      Gender: req.body.Gender,
      Feet: req.body.Feet,
      Inches: req.body.Inches,
      Weight: req.body.Weight,
      SmokerStatus: req.body.SmokerStatus,
      CoverageAmount: req.body.CoverageAmount,
      CoveragePeriod: req.body.CoveragePeriod,
      PremiumAmount: Number((req.body.CoverageAmount * basePercent) / 100)
    });
    logger.info(`User Quote Created Successfully QuoteID:${userQuote.dataValues.QuoteID} and PremiumAmount: ${userQuote.dataValues.PremiumAmount}`);
    res.send({ "QuoteID": userQuote.dataValues.QuoteID, "PremiumAmount": userQuote.dataValues.PremiumAmount });
  }
  catch (ex: any) {
    logger.error(ex);
    if (ex.name === "SequelizeValidationError") {
      res.status(400).send(ex);
    }
    else {
      res.status(500).send(ex);
    }
  }
});

router.get('/retrieveuserquotes', verifyToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    var userQuotes = await UserQuote.findAll({ where: { UserId: req.user.user_id } });
    logger.info(`User Quote retrieved Successfully UserID:${req.user.user_id}`);
    res.send(userQuotes);
  }
  catch (ex: any) {
    logger.error(ex);
    if (ex.name === "SequelizeValidationError") {
      res.status(400).send(ex);
    }
    else {
      res.status(500).send(ex);
    }
  }
});

export const userQuoteRouter: Router = router;