"use strict";

const config = require("./configurations");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    underscored: true
  },
);

// Connect all the tables / models to the db object, 
// so that, everything is accessible via a single object.

const db = {};

// Sequelize instance
db.Sequelize = Sequelize;

// Sequelize connection instance
db.sequelize = sequelize;

// Models
db.employees = require("../models/employee-model")(sequelize, Sequelize);

// All association will go here...


module.exports = db;