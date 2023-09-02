import express, { Router } from 'express';
import { usersRouter } from './Users';
import { userQuoteRouter } from './UserQuote';
import { policyRouter } from './PolicyApplication';
const router: Router = express.Router();

router.use("/user", usersRouter);
router.use("/userquote", userQuoteRouter);
router.use("/policy", policyRouter);

export const versionOneRouter: Router = router;