import { sequelizesync } from '../models/sequelize';
import bcrypt from "bcrypt";
import moment from 'moment';
import { CreateUser } from '../controllers/users.controller'
import { GenerateQuote, UpdateUserQuote, GetUserQuote, RetrieveUserQuotes, RetrieveUserQuotesByQuoteId } from '../controllers/userquotes.controller'

var user: any;
var user1: any;
beforeAll(async () => {
    await sequelizesync();
    user = await CreateUser("test@test.com", "test", "test", await bcrypt.hash("test", 10), "test");
    user1 = await CreateUser("test1@test.com", "test", "test", await bcrypt.hash("test", 10), "test");
});
describe("Create New Quote Tests", () => {
    test("Create New Quote", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        var userQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        // assert
        expect(userQuote.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(userQuote.dataValues.QuoteID).toBeGreaterThan(0);
        expect(userQuote.dataValues.PremiumAmount).toBe(8000)
    });

    test("Create New Quote With Weight Greater Than 200 And Less Than 250", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        var userQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 230, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        // assert
        expect(userQuote.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(userQuote.dataValues.QuoteID).toBeGreaterThan(0);
        expect(userQuote.dataValues.PremiumAmount).toBe(7000)
    });

    test("Create New Quote With Weight Greater Than 300", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        var userQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 320, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        // assert
        expect(userQuote.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(userQuote.dataValues.QuoteID).toBeGreaterThan(0);
        expect(userQuote.dataValues.PremiumAmount).toBe(9000)
    });

    test("Create New Quote With Date Of Birth Greater Than Current Date", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-40,'y').add(1, 'M').add(1, 'd');
        var userQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 320, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        // assert
        expect(userQuote.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(userQuote.dataValues.QuoteID).toBeGreaterThan(0);
        expect(userQuote.dataValues.PremiumAmount).toBe(8000)
    });

    test("Create New Quote With Age Greater Than 50", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-55,'y').add(1, 'M').add(1, 'd');
        var userQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 320, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        // assert
        expect(userQuote.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(userQuote.dataValues.QuoteID).toBeGreaterThan(0);
        expect(userQuote.dataValues.PremiumAmount).toBe(10000)
    });

    test("Create New Quote With Coverage Period greater than 10 years", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-55,'y').add(1, 'M').add(1, 'd');
        var userQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 320, 15, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        // assert
        expect(userQuote.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(userQuote.dataValues.QuoteID).toBeGreaterThan(0);
        expect(userQuote.dataValues.PremiumAmount).toBe(9000)
    });

    test("Create New Quote With Coverage Period greater than 20 years", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-55,'y').add(1, 'M').add(1, 'd');
        var userQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 320, 30, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        // assert
        expect(userQuote.dataValues.UserId).toBe(user.dataValues.UserId);
        expect(userQuote.dataValues.QuoteID).toBeGreaterThan(0);
        expect(userQuote.dataValues.PremiumAmount).toBe(11000)
    });


    test("Create New Quote With Age Greater Than 65", async () => {
        // arrange and act
        try {
            await GenerateQuote(new Date("04/30/1940"), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
            expect(true).toBe(false);
        }
        catch (ex: any) {
            // assert
            expect(ex.errors[0].message).toBe("Age is greater than 65");
        }
    });

    test("Create New Quote With Invalid State", async () => {
        // arrange and act
        try {
            var today = new Date();
            var dateOfBirthMoment = moment(today);
            dateOfBirthMoment.add(-55,'y');
            await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "AZ", user.dataValues.UserId, 7, 11, 100000, "M");
            expect(true).toBe(false);
        }
        catch (ex: any) {
            // assert
            expect(ex.errors[0].message).toBe("Allowed values for State are CA, NY or NJ");
        }
    });

    test("Create New Quote With Invalid Gender", async () => {
        // arrange and act
        try {
            var today = new Date();
            var dateOfBirthMoment = moment(today);
            dateOfBirthMoment.add(-55,'y');
            await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "C");
            expect(true).toBe(false);
        }
        catch (ex: any) {
            // assert
            expect(ex.errors[0].message).toBe("Allowed values for Gender are M or F");
        }
    });

    test("GetUserQuote", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        var newQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "CA", user.dataValues.UserId, 7, 11, 100000, "M");
        var userQuote = await GetUserQuote(newQuote.dataValues.QuoteID);

        // assert
        expect(userQuote).toBeDefined();
        expect(userQuote!.dataValues.QuoteID).toBe(newQuote!.dataValues.QuoteID);
    });

    test("UpdateUserQuote", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        var newQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "CA", undefined, 7, 11, 100000, "M");
        await UpdateUserQuote(newQuote.dataValues.QuoteID, user.dataValues.UserId);
        var updatedQuote = await GetUserQuote(newQuote.dataValues.QuoteID);

        // assert
        expect(updatedQuote).toBeDefined();
        expect(updatedQuote!.dataValues.QuoteID).toBe(newQuote!.dataValues.QuoteID);
        expect(updatedQuote!.dataValues.UserId).toBe(user!.dataValues.UserId);
    });

    test("RetrieveUserQuotes", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "CA", user!.dataValues.UserId, 7, 11, 100000, "M");
        var userQuotes = await RetrieveUserQuotes(user.dataValues.UserId);

        // assert
        expect(userQuotes).toBeDefined();
        expect(userQuotes.length).toBeGreaterThan(0);
        userQuotes.forEach(userQuote => {
            expect(userQuote.dataValues.UserId).toBe(user!.dataValues.UserId);
        });
    });

    test("RetrieveUserQuotesShouldNotReturnOtherUserQuotes", async () => {
        // arrange and act
        var userQuotes = await RetrieveUserQuotes(user1.dataValues.UserId);

        // assert
        expect(userQuotes).toBeDefined();
        expect(userQuotes.length).toBe(0);
    });

    test("RetrieveUserQuotesByQuoteId", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        var newQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "CA", user!.dataValues.UserId, 7, 11, 100000, "M");
        var userQuote = await RetrieveUserQuotesByQuoteId(user!.dataValues.UserId, newQuote.dataValues.QuoteID);

        // assert
        expect(userQuote).toBeDefined();
        expect(userQuote!.dataValues.QuoteID).toBe(newQuote!.dataValues.QuoteID);
        expect(userQuote!.dataValues.UserId).toBe(newQuote!.dataValues.UserId);
    });

    test("RetrieveUserQuotesByQuoteIdWithOtherUserShouldNotreturnQuote", async () => {
        // arrange and act
        var today = new Date();
        var dateOfBirthMoment = moment(today);
        dateOfBirthMoment.add(-43,'y');
        var newQuote = await GenerateQuote(new Date(dateOfBirthMoment.format("MM/DD/yyyy")), "Smoker", 250, 20, "CA", user!.dataValues.UserId, 7, 11, 100000, "M");
        var userQuote = await RetrieveUserQuotesByQuoteId(user1.dataValues.UserId, newQuote.dataValues.QuoteID);

        // assert
        expect(userQuote).toBeNull();
    });
});