"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
    class EmployeeTrack extends Model { }
    EmployeeTrack.init({
        isLoggedIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
        dateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },
        { sequelize, modelName: "employee_track", timestamps: false }
    );
    return EmployeeTrack;
};
