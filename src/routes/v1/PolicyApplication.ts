import express, { Response, Router, NextFunction } from 'express';
import { verifyToken, authorizeWithEmail } from "../../middlewares/auth";
import { logger } from '../../logger/logger';
import { RetrieveUserDetailsById, RetrieveUserDetails } from "../../controllers/users.controller"
import { RetrieveUserQuotesByQuoteId } from "../../controllers/userquotes.controller"
import { CreateApplication, RetrieveApplicationFromApplicationId, UpdateApplication } from "../../controllers/policyapplication.controller"
const router: Router = express.Router();

router.post('/createapplication/:QuoteID', verifyToken, async (req: any, res: Response, next: NextFunction) => {
    try {
        var user = await RetrieveUserDetailsById(req.user.user_id);
        if (user) {
            var userQuote = await RetrieveUserQuotesByQuoteId(req.user.user_id, req.params.QuoteID);
            if (userQuote) {
                const application = await CreateApplication(userQuote, user, req.user.user_id, req.body.MiddleName,
                    req.body.AddressLine1, req.body.AddressLine2, req.body.ZipCode, req.body.Occupation, req.body.Salary,
                    req.body.HealthCondition, req.body.LifeStyle);
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
        logger.error(ex, { service: 'application-service' })
        if (ex.name === "SequelizeValidationError") {
            res.status(400).send(ex);
        }
        else {
            res.status(500).send(ex.message);
        }
    }
});

router.get('/retrieveapplication/:ApplicationId/:email', authorizeWithEmail, async (req: any, res: Response, next: NextFunction) => {
    try {
        var user = await RetrieveUserDetails(req.params.email);
        if (user) {
            var userApplication = await RetrieveApplicationFromApplicationId(user.dataValues.UserId, req.params.ApplicationId);
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
    catch (ex: any) {
        logger.error(ex);
        if (ex.name === "SequelizeValidationError") {
            res.status(400).send(ex);
        }
        else {
            res.status(500).send(ex.message);
        }
    }
});

router.post('/updateApplication/:ApplicationId/:email', authorizeWithEmail, async (req: any, res: Response, next: NextFunction) => {
    try {
        var user = await RetrieveUserDetails(req.params.email);
        if (user) {
            var userApplication = await RetrieveApplicationFromApplicationId(user.dataValues.UserId, req.params.ApplicationId);
            if (userApplication) {
                var updatedModel = await UpdateApplication(req.body.MiddleName, req.body.AddressLine1, req.body.AddressLine2,
                    req.body.ZipCode, req.body.Occupation, req.body.Salary, req.body.HealthCondition, req.body.LifeStyle,
                    req.params.ApplicationId, user.dataValues.UserId);
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
    catch (ex: any) {
        logger.error(ex);
        if (ex.name === "SequelizeValidationError") {
            res.status(400).send(ex);
        }
        else {
            res.status(500).send(ex.message);
        }
    }
});

export const policyRouter: Router = router;