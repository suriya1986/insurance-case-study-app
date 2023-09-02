import { InsurancePolicyApplication } from '../models/InsuranceApplicationModel';

export const CreateApplication = async function (userQuote: any, user: any, userId: number, middleName: string,
    addressLine1: string, addressLine2: string, zipCode: number, occcupation: string, salary: string, healthCondition: string, lifeStyle: string) {
    const application = await InsurancePolicyApplication.create({
        UserId: userId,
        FirstName: user.dataValues.FirstName,
        MiddleName: middleName,
        LastName: user.dataValues.LastName,
        AddressLine1: addressLine1,
        AddressLine2: addressLine2,
        ZipCode: zipCode,
        DateOfBirth: userQuote.dataValues.DateOfBirth,
        Gender: userQuote.dataValues.Gender,
        Height: userQuote.dataValues.Feet + ' ft ' + userQuote.dataValues.Inches + ' inches',
        Weight: userQuote.dataValues.Weight + ' pounds',
        SmokerStatus: userQuote.dataValues.SmokerStatus,
        Occupation: occcupation,
        Salary: salary,
        HealthCondition: healthCondition,
        LifeStyle: lifeStyle,
        CoverageAmount: userQuote.dataValues.CoverageAmount,
        CoveragePeriod: userQuote.dataValues.CoveragePeriod,
    });
    return application;
};

export const RetrieveApplicationFromApplicationId = async function (userId: number, ApplicationId: number) {
    return await InsurancePolicyApplication.findOne({ where: { ApplicationId: ApplicationId, UserId: userId } });
};

export const UpdateApplication = async function (middleName: string,
    addressLine1: string, addressLine2: string, zipCode: number, occcupation: string, salary: string, 
    healthCondition: string, lifeStyle: string, applicationId: number, userId: number) {
        var updatedModel = await InsurancePolicyApplication.update({
            MiddleName: middleName,
            AddressLine1: addressLine1,
            AddressLine2: addressLine2,
            ZipCode: zipCode,
            Occupation: occcupation,
            Salary: salary,
            HealthCondition: healthCondition,
            LifeStyle: lifeStyle,
        },
            { where: { ApplicationId: applicationId, UserId: userId } });
    return updatedModel;
};