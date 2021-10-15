"use strict";

const router = require('express').Router();
const { verifyJwtToken, generateJwtToken } = require('../middleware/jwt');
const db = require("../config/db");

/**
 * @swagger
 * /employee/fetch-all:
 *  get:
 *    description: This api secured by jwt, first need to set on request headers authorization jwt-token
 *    responses:
 *      '200':
 *        description: A successful response get all employees details, if passing request query followed by this api like ?employee_tracks=1 get employee details with login & logout information, If get specific attribute pass request query in the form of array like &attr[0]=email like same as for nested record &employee_tracks_attr[0]=id&employee_tracks_attr[1]=isLoggedIn.
 */
router.get('/fetch-all', verifyJwtToken, async (req, res, next) => {
    try {
        const { attr, sort = "id", order = "asc", employee_tracks, employee_tracks_attr } = req.query;
        let response = {}, args = { order: [[sort, order]] }, includes = [];

        if (attr) args.attributes = attr;

        if (+employee_tracks) {
            includes.push({
                model: db.employee_tracks,
                attributes: employee_tracks_attr
            })
        }

        if (includes.length) args.include = includes;

        response.data = await db.employees.findAll(args);

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /employee/create:
 *  post:
 *    description: Create employee by sending email-id with email as key of object, After create successfully and then employee set as login.
 *    responses:
 *      '200':
 *        description: A successful response get back with employee detail and jwt token for validate secure api, for interact with other api.
 */
router.post('/create', async (req, res, next) => {
    try {
        const employee = req.body;
        let response = {};

        const newEmployee = await db.employees.create(employee);
        await db.employee_tracks.create({ employeeEmail: newEmployee.email });
        response.data = newEmployee;

        response.jwtToken = await generateJwtToken({ email: newEmployee.email });

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /employee/reports/:email:
 *  get:
 *    description: This api secured by jwt, first need to set on request headers authorization jwt-token
 *    responses:
 *      '200':
 *        description: A successful response get employee details, If get specific attribute pass request query in the form of array like &attr[0]=email like same as for nested record &employee_tracks_attr[0]=id&employee_tracks_attr[1]=isLoggedIn.
 */
router.get('/reports/:email', verifyJwtToken, async (req, res, next) => {
    try {
        const { attr, employee_tracks_attr } = req.query;
        const { email } = req.params;

        let response = {}, args = { where: { email } };

        if (attr) args.attributes = attr;

        args.include = [{
            model: db.employee_tracks,
            attributes: employee_tracks_attr
        }];

        response.data = await db.employees.findOne(args);
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
