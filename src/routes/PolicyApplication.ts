import express, { Request, Response, Router, NextFunction } from 'express';
import { UserQuote } from '../models/UserQuotesModel';
import { verifyToken, authorizeWithEmail } from "../middlewares/auth";
import { Users } from '../models/UserModel';
import { InsurancePolicyApplication } from '../models/InsuranceApplicationModel';
import { logger } from '../logger/logger';

const router: Router = express.Router();

router.post('/createapplication/:QuoteID', verifyToken, async (req: any, res: Response, next: NextFunction) => {
    try {
        var user = await Users.findOne({ where: { UserId: req.user.user_id } });
        if (user) {
            var userQuote = await UserQuote.findOne({ where: { QuoteID: req.params.QuoteID, UserId: req.user.user_id } });
            if (userQuote) {
                const application = await InsurancePolicyApplication.create({
                    UserId: req.user.user_id,
                    FirstName: user.dataValues.FirstName,
                    MiddleName: req.body.MiddleName,
                    LastName: user.dataValues.LastName,
                    AddressLine1: req.body.AddressLine1,
                    AddressLine2: req.body.AddressLine2,
                    ZipCode: req.body.ZipCode,
                    DateOfBirth: userQuote.dataValues.DateOfBirth,
                    Gender: userQuote.dataValues.Gender,
                    Height: userQuote.dataValues.Feet + ' ft ' + userQuote.dataValues.Inches + ' inches',
                    Weight: userQuote.dataValues.Weight + ' pounds',
                    SmokerStatus: userQuote.dataValues.SmokerStatus,
                    Occupation: req.body.Occupation,
                    Salary: req.body.Salary,
                    HealthCondition: req.body.HealthCondition,
                    LifeStyle: req.body.LifeStyle,
                    CoverageAmount: userQuote.dataValues.CoverageAmount,
                    CoveragePeriod: userQuote.dataValues.CoveragePeriod,
                });
                logger.info(`User Policy created Successfully for UserID:${req.user.user_id} from Quote:${req.params.QuoteID}`);
                application.setDataValue("success", true);
                res.send(application);
            }
            else {
                logger.info(`Missing User Quote for UserID:${req.user.user_id} from Quote:${req.params.QuoteID}`)
                res.status(404).send("Invalid User Quote Details!");
            }
        }
        else {
            logger.info(`Missing User details for UserID:${req.user.user_id}`)
            res.status(404).send("Invalid User Details!");
        }
    }
    catch (ex: any) {
        if (ex.name === "SequelizeValidationError") {
            res.status(400).send(ex);
        }
        else {
            res.status(500).send(ex);
        }
    }
});

router.post('/retrieveapplication/:ApplicationId/:email', authorizeWithEmail, async (req: any, res: Response, next: NextFunction) => {
    try {
        var user = await Users.findOne({ where: { EmailAddress: req.params.email } });
        if (user) {
            var userApplication = await InsurancePolicyApplication.findOne({ where: { ApplicationId: req.params.ApplicationId, UserId: user.dataValues.UserId } });
            if (userApplication) {
                logger.info(`User application retrieved Successfully for Email:${req.params.email}, ApplicationID:${req.params.ApplicationId}`);
                res.send(userApplication);
            }
            else {
                logger.info(`Missing User application details for Email:${req.params.email}, ApplicationID:${req.params.ApplicationId}`);
                res.status(400).send("Application Details not found!");
            }
        }
        else {
            logger.info(`Missing User details for Email:${req.params.email}`);
            res.status(400).send("Invalid User Details!");
        }
    }
    catch (ex) {
        logger.error(ex);
        res.send(ex);
    }
});

router.post('/updateApplication/:ApplicationId/:email', authorizeWithEmail, async (req: any, res: Response, next: NextFunction) => {
    try {
        var user = await Users.findOne({ where: { EmailAddress: req.params.email } });
        if (user) {
            var userApplication = await InsurancePolicyApplication.findOne({ where: { ApplicationId: req.params.ApplicationId, UserId: user.dataValues.UserId } });
            if (userApplication) {
                var updatedModel = await InsurancePolicyApplication.update({
                    MiddleName: req.body.MiddleName,
                    AddressLine1: req.body.AddressLine1,
                    AddressLine2: req.body.AddressLine2,
                    ZipCode: req.body.ZipCode,
                    Occupation: req.body.Occupation,
                    Salary: req.body.Salary,
                    HealthCondition: req.body.HealthCondition,
                    LifeStyle: req.body.LifeStyle,
                },
                    { where: { ApplicationId: req.params.ApplicationId, UserId: user.dataValues.UserId } });
                logger.info(`User application updated Successfully for Email:${req.params.email}, ApplicationID:${req.params.ApplicationId}`);
                res.send({ "Success": true });
            }
            else {
                logger.info(`Missing User application details for Email:${req.params.email}, ApplicationID:${req.params.ApplicationId}`);
                res.status(400).send("Invalid User Application Details!");
            }
        }
        else {
            logger.info(`Missing User details for Email:${req.params.email}`);
            res.status(400).send("Invalid User Details!");
        }
    }
    catch (ex) {
        logger.error(ex);
        res.send(ex);
    }
});

export const policyRouter: Router = router;