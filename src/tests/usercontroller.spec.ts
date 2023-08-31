import { sequelizesync } from '../models/sequelize';
import bcrypt from "bcrypt";
import { CreateUser, RetrieveUserDetails, RetrieveUserDetailsById, ValidatePassword, GenerateToken } from '../controllers/users.controller'


beforeAll(async () => await sequelizesync());
describe("Create New User Tests", () => {
    test("Create New User", async () => {
        // arrange and act
        var user = await CreateUser("test@test.com", "test", "test", await bcrypt.hash("test", 10), "test");

        // assert
        expect(user.dataValues.UserId).toBeGreaterThan(0);
    });

    test("RetrieveUserDetails", async () => {
        // arrange and act
        var user = await RetrieveUserDetails("test@test.com");

        // assert
        expect(user).toBeDefined();
        expect(user!.dataValues.UserId).toBeGreaterThan(0);
        expect(user!.dataValues.EmailAddress).toEqual("test@test.com");
    });

    test("RetrieveUserDetailsById", async () => {
        // arrange and act
        var user = await RetrieveUserDetailsById(1);

        // assert
        expect(user).toBeDefined();
        expect(user!.dataValues.UserId).toBeGreaterThan(0);
        expect(user!.dataValues.UserId).toEqual(1);
    });

    test("ValidatePassword", async () => {
        // arrange and act
        var user = await RetrieveUserDetailsById(1);
        var result = await ValidatePassword("test", user!.dataValues.Password);

        // assert
        expect(result).toBeDefined();
        expect(result).toEqual(true);
    });

    test("GenerateToken", async () => {
        // arrange and act
        var user = await RetrieveUserDetailsById(1);
        var result = await GenerateToken(user!.dataValues.UserId, user!.dataValues.EmailAddress);

        // assert
        expect(result).not.toBe('');
    });
});