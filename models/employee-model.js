"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
    class Employee extends Model { }
    Employee.init({
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Employee with this email-id already exist'
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Invalid email-id'
                },
            },
        },
        password: {
            type: DataTypes.STRING,
        },
        googleId: {
            type: DataTypes.STRING,
        },
    },
        { sequelize, modelName: "employee", timestamps: false }
    );
    return Employee;
};
