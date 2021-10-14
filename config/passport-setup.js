"use strict";

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { generateJwtToken } = require('../middleware/jwt');
require("dotenv").config();

const { CLIENT_ID, CLIENT_SECRET } = process.env;

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    }, async (accessToken, refreshToken, profile, done) => {

        const employee = await db.employees.findOne({ where: { googleId: profile.id } });
        
        if (employee) {
            // already have this employee
            done(null, employee);
        } else {
            // if not, create employee in our db
            const payload = {
                googleId: profile.id,
                email: profile.emails[0].value,
            };

            const newEmployee = await db.employees.create(payload);

            const jwtToken = await generateJwtToken(newEmployee);

            const employee = { jwtToken, data: newEmployee };

            done(null, employee);
        }
    })
);
