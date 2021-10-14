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
        },
        password: {
            type: DataTypes.STRING,
        },
        googleId: {
            type: DataTypes.STRING,
        },
    },
        { sequelize, modelName: "employee" }
    );
    return Employee;
};
