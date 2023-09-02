import { Users } from '../models/UserModel';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const CreateUser = async function (emailAddress: string, firstName: string, lastName: string, password: string, securityQuestion: string) {
    return await Users.create({
        EmailAddress: emailAddress,
        FirstName: firstName,
        LastName: lastName,
        Password: password,
        SecurityQuestion: securityQuestion,
    });
};

export const RetrieveUserDetails = async function (emailAddress: string) {
    return await Users.findOne({ where: { EmailAddress: emailAddress } });
};

export const RetrieveUserDetailsById = async function (userId: number) {
    return await await Users.findOne({ where: { UserId: userId } });
};

export const ValidatePassword = async function (password: string, passwordhash: string) {
    return await bcrypt.compare(password, passwordhash);
};

export const GenerateToken = async function (userId: number, email: string) {
    return jwt.sign(
        { user_id: userId, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
};