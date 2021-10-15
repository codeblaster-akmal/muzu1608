"use strict";

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { generateJwtToken } = require('../middleware/jwt');
const db = require("./db");
require("dotenv").config();

const { CLIENT_ID, CLIENT_SECRET } = process.env;

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    }, async (accessToken, refreshToken, profile, done) => {

        let employee = await db.employees.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { googleId: profile.id },
                    { email: profile.emails[0].value },
                ]
            }
        });

        if (!employee) {
            // if not, create employee in our db
            const payload = {
                googleId: profile.id,
                email: profile.emails[0].value,
            };

            employee = await db.employees.create(payload);
        }
        await db.employee_tracks.create({ employeeEmail: employee.email });

        const jwtToken = await generateJwtToken(employee);

        const data = { jwtToken, data: employee };
        done(null, data);

    })
);
