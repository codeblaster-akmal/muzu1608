"use strict";

/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
    let message = "";

    if (error.parent) {
        switch (error.parent.errno) {
            case 1451:
                message = error.table + ' is in use';
                break;
            case 1452:
                message = error.table + ' not exists'
                break;
            case 1062:
                message = error.errors[0].message;
                break;
            default:
                message = error;
        }
    } else {
        if (error.name == 'SequelizeValidationError') {
            message = error.errors[0].message;

        } else if (error.name == 'SequelizeUniqueConstraintError' && error.fields.PRIMARY) {
            message = 'This Id already registered';

        } else if (error.name == 'SequelizeUniqueConstraintError' && error.parent.errno == 1062) {
            message = error.errors[0].message;

        } else {
            if (error.error == undefined && error.message == "this.build(...).save is not a function") {
                message = 'Invalid data format';
            } else {
                message = "Something went wrong on server";
            }
        }
    }

    return message;
};

