const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const employeeRoutes = require('./routes/employee-routes');
const config = require("./config/configurations");
const db = require("./config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Customer API",
            description: "Customer API Information",
            contact: {
                name: "Amazing Developer"
            },
            servers: ["http://localhost:5000"]
        }
    },
    // ['.routes/*.js']
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// initialize passport
app.use(passport.initialize());

// initialize bodyParser
app.use(express.json());

// set up routes
app.use('/auth', authRoutes);
app.use('/employee', employeeRoutes);

// error handlers
app.use((error, req, res, next) => {
    console.log(`SERVER ERROR: ${error.stack}`);
    res.status(400).json({
        error: error,
    });
});

// create home route
/**
 * @swagger
 * /:
 *  get:
 *    description: Server test request
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get('/', (req, res, next) => {
    try {
        res.status(200).json({
            'applicationName': 'TEST_SERVER',
            'status': 'Up',
            'date': new Date()
        });
    } catch (error) {
        next(error);
    }
});

app.listen(3000, () => {
    db.sequelize.sync({ force: config.db.force, logging: console.log })
        .then(() => {
            console.log("Connection has been established successfully");
            console.log(`Started application on http://localhost:${config.port}`);
        })
        .catch((err) => {
            console.error("Unable to connect to the database:", err);
        });
});
