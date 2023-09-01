import { UserQuote } from '../models/UserQuotesModel';

export const GetUserQuote = async function (quoteId: number) {
    return await UserQuote.findByPk(quoteId);
};

export const UpdateUserQuote = async function (quoteId: number, userId: number) {
    await UserQuote.update({ UserId: userId }, { where: { QuoteID: quoteId } });
};

export const GenerateQuote = async function (dateOfBirth: Date, smokerStatus: string, weight: number, coveragePeriod: number, 
    state: string,userId : number|undefined, feet: number,inches : number,coverageAmount: number, gender: string) {
        var basePercent = 1;
        if (smokerStatus == "Smoker") {
          basePercent++;
        }
        if (weight > 200 && weight < 250) {
          basePercent++;
        }
        else if (weight >= 200 && weight < 300) {
          basePercent += 2;
        }
        else if (weight > 300) {
          basePercent += 3;
        }
        var today = new Date();
        var age = today.getFullYear() - dateOfBirth.getFullYear();
        var m = today.getMonth() - dateOfBirth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
          age--;
        }
        if (age > 30 && age < 40) {
          basePercent += 1;
        }
        else if (age >= 40 && age < 50) {
          basePercent += 2;
        }
        else if (age >= 50 && age < 60) {
          basePercent += 3;
        }
        else if (age >= 60) {
          basePercent += 5;
        }
        if (coveragePeriod > 10 && coveragePeriod <= 15) {
          basePercent += 1;
        }
        else if (coveragePeriod > 15 && coveragePeriod <= 20) {
          basePercent += 2;
        }
        else if (coveragePeriod > 20 && coveragePeriod <= 30) {
          basePercent += 3;
        }
       
        return await UserQuote.create({
          State: state,
          UserId: userId ? userId : null,
          DateOfBirth: dateOfBirth,
          Gender: gender,
          Feet: feet,
          Inches: inches,
          Weight: weight,
          SmokerStatus: smokerStatus,
          CoverageAmount: coverageAmount,
          CoveragePeriod: coveragePeriod,
          PremiumAmount: Number((coverageAmount * basePercent) / 100)
        });
};

export const RetrieveUserQuotes = async function (userId: number) {
    return await UserQuote.findAll({ where: { UserId: userId } });
};

export const RetrieveUserQuotesByQuoteId = async function (userId: number, quoteId: number) {
  return await UserQuote.findOne({ where: { QuoteID: quoteId, UserId: userId } });;
};