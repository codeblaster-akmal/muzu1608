"use strict";

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { generateJwtToken } = require('../middleware/jwt');
const db = require("./db");
require("dotenv").config();

const { CLIENT_ID, CLIENT_SECRET } = process.env;

passport.use(
    new FacebookStrategy({
        // options for facebook strategy
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: '/auth/facebook/redirect',
        profileFields: ['id', 'email']
    }, async (accessToken, refreshToken, profile, done) => {

        let employee = await db.employees.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { facebookId: profile.id },
                    { email: profile.emails[0].value },
                ]
            }
        });

        if (!employee) {
            // if not, create employee in our db
            const payload = {
                facebookId: profile.id,
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
