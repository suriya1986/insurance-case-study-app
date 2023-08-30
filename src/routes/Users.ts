import express, { Request, Response, Router, NextFunction } from 'express';
import bcrypt from "bcrypt";
import { Users } from '../models/UserModel';
import { UserQuote } from '../models/UserQuotesModel';
const router: Router = express.Router();
import jwt from "jsonwebtoken";
import { logger } from '../logger/logger';

router.post('/createuser', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Password = await bcrypt.hash(req.body.Password, 10);
    const newUser = await Users.create({
      EmailAddress: req.body.EmailAddress,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: Password,
      SecurityQuestion: req.body.SecurityQuestion,
    });
    if (req.body.QuoteID) {
      var userQuote = await UserQuote.findByPk(req.body.QuoteID);
      if (userQuote) {
        await UserQuote.update({ UserId: newUser.dataValues.UserId }, { where: { QuoteID: req.body.QuoteID } });
      }
      else {
        logger.info(`User Quote Missing:${req.body.QuoteID}`);
      }
    }
    res.send({
      "success": true,
      UserId: newUser.dataValues.UserId,
      EmailAddress: newUser.dataValues.EmailAddress,
      FirstName: newUser.dataValues.FirstName,
      LastName: newUser.dataValues.LastName
    });
  }
  catch (ex: any) {
    logger.error(ex);
    if (ex.errors && ex.errors.count > 0 && ex.errors[0].message === "EmailAddress must be unique") {
      res.status(400);
    }
    else {
      res.status(500);
    }
    res.send(ex.errors[0].message);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // Validate user input
  if (!(email && password)) {
    res.status(400).send("All input is required");
  }
  const user = await Users.findOne({ where: { EmailAddress: email } });
  if (user && await bcrypt.compare(password, user.dataValues.Password)) {
    logger.info(`User Login Successful:${email}`);
    const token = jwt.sign(
      { user_id: user.dataValues.UserId, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.send(token);
  }
  else {
    logger.info(`User Login unsuccessful:${email}`);
    res.status(400).send("Invalid Credentials");
  }
});

export const usersRouter: Router = router;