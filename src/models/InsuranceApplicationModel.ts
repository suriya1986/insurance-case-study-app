import { DataTypes } from 'sequelize';
import { sequelize } from './sequelize';

export const InsurancePolicyApplication = sequelize.define('InsurancePolicyApplications', {
    ApplicationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    UserId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    MiddleName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    AddressLine1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    AddressLine2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ZipCode: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    DateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Height: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Weight: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SmokerStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Occupation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Salary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    HealthCondition: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:
        {
            isIn:
            {
                args: [["Normal", "Diabetic", "Heart Disease"]],
                msg: "Allowed values for HealthCondition are Normal, Diabetic or Heart Disease"
            }
        }
    },
    LifeStyle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:
        {
            isIn:
            {
                args: [["Sedentary", "Active", "Athlete"]],
                msg: "Allowed values for LifeStyle are Sedentary, Active or Athlete"
            }
        }
    },
    CoverageAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CoveragePeriod: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: 'InsurancePolicyApplications'
});