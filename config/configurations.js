"use strict";

require("dotenv").config();

// Application level configurations will go here..

const {
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_REFRESH
} = process.env;

const configuration = {
  port: PORT || 3000, // PORT Number
  db: {
    host: DATABASE_HOST || "localhost",
    port: DATABASE_PORT || 3306,
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    dialect: "mysql",
    force: +DATABASE_REFRESH,
  }
};

module.exports = configuration;
