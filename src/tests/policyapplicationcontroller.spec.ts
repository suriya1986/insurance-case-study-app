import { sequelizesync } from '../models/sequelize';
import bcrypt from "bcrypt";
import { CreateUser } from '../controllers/users.controller'
import { GenerateQuote } from '../controllers/userquotes.controller'
import { CreateApplication ,RetrieveApplicationFromApplicationId,UpdateApplication} from '../controllers/policyapplication.controller'

var user: any;
var user1: any;
beforeAll(async () => {
    await sequelizesync();
    user = await CreateUser("test@test.com", "test", "test", await bcrypt.hash("test", 10), "test");
    user1 = await CreateUser("test1@test.com", "test", "test", await bcrypt.hash("test", 10), "test");
});

describe("Create New Application Tests", () => {
    test("Create New Application", async () => {
        // arrange and act
        var userQuote = await GenerateQuote(new Date("04/30/1980"), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        var newApplication = await CreateApplication(userQuote,user,user.dataValues.UserId,"Test","Test" ,"Test",123456,"SE","10Crore","Normal","Active");
        // assert
        expect(newApplication.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(newApplication.dataValues.FirstName).toBe(user.dataValues.FirstName);
        expect(newApplication.dataValues.LastName).toBe(user.dataValues.LastName);
        expect(newApplication.dataValues.DateOfBirth).toBe(userQuote.dataValues.DateOfBirth);
        expect(newApplication.dataValues.Gender).toBe(userQuote.dataValues.Gender);
        expect(newApplication.dataValues.SmokerStatus).toBe(userQuote.dataValues.SmokerStatus);
        expect(newApplication.dataValues.CoveragePeriod).toBe(userQuote.dataValues.CoveragePeriod);
        expect(newApplication.dataValues.CoverageAmount).toBe(userQuote.dataValues.CoverageAmount);
        expect(newApplication.dataValues.Salary).toBe("10Crore");
        expect(newApplication.dataValues.HealthCondition).toBe("Normal");
        expect(newApplication.dataValues.LifeStyle).toBe("Active");
    });

    test("Create New Application With Invalid Health Condition", async () => {
        // arrange and act
        try {
            var userQuote = await GenerateQuote(new Date("04/30/1980"), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        var newApplication = await CreateApplication(userQuote,user,user.dataValues.UserId,"Test","Test" ,"Test",123456,"SE","10Crore","Test","Active")
            expect(true).toBe(false);
        }
        catch (ex: any) {
            // assert
            expect(ex.errors[0].message).toBe("Allowed values for HealthCondition are Normal, Diabetic or Heart Disease");
        }
    });

    test("Create New Application With Invalid Lifestyle", async () => {
        // arrange and act
        try {
            var userQuote = await GenerateQuote(new Date("04/30/1980"), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
            await CreateApplication(userQuote,user,user.dataValues.UserId,"Test","Test" ,"Test",123456,"SE","10Crore","Normal","Test")
            expect(true).toBe(false);
        }
        catch (ex: any) {
            // assert
            expect(ex.errors[0].message).toBe("Allowed values for LifeStyle are Sedentary, Active or Athlete");
        }
    });

    test("RetrieveApplicationFromApplicationId", async () => {
        // arrange and act
        var userQuote = await GenerateQuote(new Date("04/30/1980"), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        var newApplication = await CreateApplication(userQuote,user,user.dataValues.UserId,"Test","Test" ,"Test",123456,"SE","10Crore","Normal","Active")
        var userApplication = await RetrieveApplicationFromApplicationId(user.dataValues.UserId, newApplication.dataValues.ApplicationId);
        // assert
        expect(userApplication).toBeDefined();
        expect(userApplication!.dataValues.ApplicationId).toBe(newApplication!.dataValues.ApplicationId);
        expect(userApplication!.dataValues.UserId).toBe(user!.dataValues.UserId);
    });

    test("UpdateApplication", async () => {
        // arrange and act
        var userQuote = await GenerateQuote(new Date("04/30/1980"), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        var newApplication = await CreateApplication(userQuote,user,user.dataValues.UserId,"Test","Test" ,"Test",123456,"SE","10Crore","Normal","Active")
        var updatedCount = await UpdateApplication("TEST1","MUMBAI","CHEMBUR",410210,"TL","50000","Diabetic","Athlete",newApplication.dataValues.ApplicationId, user.dataValues.UserId);
        var updatedApplication = await RetrieveApplicationFromApplicationId(user.dataValues.UserId, newApplication.dataValues.ApplicationId);
        // assert
        expect(updatedApplication).toBeDefined();
        expect(updatedApplication!.dataValues.ApplicationId).toBe(newApplication!.dataValues.ApplicationId);
        expect(updatedApplication!.dataValues.UserId).toBe(user!.dataValues.UserId);
        expect(updatedApplication!.dataValues.MiddleName).toBe("TEST1");
        expect(updatedApplication!.dataValues.AddressLine1).toBe("MUMBAI");
        expect(updatedApplication!.dataValues.AddressLine2).toBe("CHEMBUR");
        expect(updatedApplication!.dataValues.ZipCode).toBe(410210);
        expect(updatedApplication!.dataValues.Occupation).toBe("TL");
        expect(updatedApplication!.dataValues.Salary).toBe("50000");
        expect(updatedApplication!.dataValues.HealthCondition).toBe("Diabetic");
        expect(updatedApplication!.dataValues.LifeStyle).toBe("Athlete");
    });


});