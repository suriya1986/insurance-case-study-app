import express, { Request, Response, Router, NextFunction } from 'express';
import bcrypt from "bcrypt";
const router: Router = express.Router();
import { logger } from '../../logger/logger';
import { CreateUser, RetrieveUserDetails, ValidatePassword, GenerateToken } from "../../controllers/users.controller"
import { GetUserQuote, UpdateUserQuote } from "../../controllers/userquotes.controller"

router.post('/createuser', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Password = await bcrypt.hash(req.body.Password, 10);
    const newUser = await CreateUser(req.body.EmailAddress, req.body.FirstName, req.body.LastName, Password, req.body.SecurityQuestion);

    if (req.body.QuoteID) {
      var userQuote = await GetUserQuote(req.body.QuoteID);
      if (userQuote) {
        await UpdateUserQuote(req.body.QuoteID, newUser.dataValues.UserId);
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
    if (ex.errors && ex.errors.length > 0 && ex.name === "SequelizeUniqueConstraintError") {
      res.status(400).send(ex.errors);
    }
    else {
      res.status(500).send(ex.message);
    }
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await RetrieveUserDetails(email);
    if (user && await ValidatePassword(password, user.dataValues.Password)) {
      logger.info(`User Login Successful:${email}`);
      const token = await GenerateToken(user.dataValues.UserId, email);
      res.send(token);
    }
    else {
      logger.info(`User Login unsuccessful:${email}`);
      res.status(400).send("Invalid Credentials");
    }
  }
  catch (ex: any) {
    logger.error(ex);
    if (ex.errors && ex.errors.count > 0 && ex.errors[0].message === "EmailAddress must be unique") {
      res.status(400).send(ex);
    }
    else {
      res.status(500).send(ex.message);
    }
  }
});

export const usersRouter: Router = router;