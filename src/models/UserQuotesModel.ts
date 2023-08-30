import { DataTypes } from 'sequelize';
import { sequelize } from './sequelize';

export const UserQuote = sequelize.define('UserQuotes', {
    QuoteID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    State: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [["CA", "NY", "NJ"]],
                msg: "Allowed values for Gender are CA, NY or NJ"
            }
        }
    },
    PremiumAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            IsValidAge(value) {
                if (value === null) {
                    throw new Error("Age can't be null");
                }
                else {
                    var today = new Date();
                    var birthDate = new Date(value);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    if (age <18) {
                        throw new Error("Age is less than 18");
                    }
                    else if(age>65)
                    {
                        throw new Error("Age is greater than 65");
                    }
                }
            }
        }
    },
    Gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [["M", "F"]],
                msg: "Allowed values for Gender are M or F"
            }
        }
    },
    Feet: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate:
        {
            IsValidFeet(value) {
                if (value === null) {
                    throw new Error("Feet can't be null");
                }
                if(value>7)
                {
                    throw new Error("Feet is greater than allowed limit(7 feet)");
                }
            }
        }
    },
    Inches: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate:
        {
            IsValidInches(value) {
                if (value === null) {
                    throw new Error("Inches can't be null");
                }
                if(value>11)
                {
                    throw new Error("Inches is greater than allowed limit(11 Inches)");
                }
            }
        }
    },
    Weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:
        {
            IsValidWeight(value) {
                if (value === null) {
                    throw new Error("Weight can't be null");
                }
                if(value>350)
                {
                    throw new Error("Weight is greater than allowed limit(350 pounds)");
                }
            }
        }
    },
    SmokerStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [["Smoker", "Non-Smoker"]],
                msg: "Allowed Values for Smoker Status are Smoker/Non-Smoker"
            }
        }
    },
    CoverageAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 100000,
            max: 500000
        }
    },
    CoveragePeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: {
                args: [[10, 15, 20, 30]],
                msg: "Allowed years are 10,15,20,30"
            }
        }
    }
}, {
    modelName: 'UserQuotes'
});