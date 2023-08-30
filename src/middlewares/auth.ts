import { request } from "http";
import { decode } from "punycode";
import { logger } from '../logger/logger';
const jwt = require("jsonwebtoken");

export const verifyToken =function (req, res, next){
  const token =
    req.body.token || req.query.token || req.params.token || req.headers["x-access-token"];

  if (!token) {
    logger.info("Missing Token");
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    logger.error("Invalid Token, Authentication Failed");
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export const authorizeWithEmail =function (req, res, next){
  const token =
    req.body.token || req.query.token || req.params.token || req.headers["x-access-token"];
  const email = req.body.email || req.query.email || req.params.email;
  if (!token) {
    logger.info("Missing Token");
    return res.status(403).send("A token is required for authentication");
  }
  if(!email)
  {
    logger.info("Missing email, authorization failed");
    return res.status(403).send("Missing Email!");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if(decoded.email !== email)
    {
      logger.info("email mismatch, authorization failed");
      return res.status(403).send("Authorization Failed!");
    }
    req.user = decoded;
  } catch (err) {
    logger.error("Invalid Token, Authentication Failed");
    return res.status(401).send("Invalid Token");
  }
  return next();
};