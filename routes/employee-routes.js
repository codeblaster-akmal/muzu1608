"use strict";

const router = require('express').Router();
const { verifyJwtToken, generateJwtToken } = require('../middleware/jwt');

/**
 * @swagger
 * /employee/fetch-all:
 *  get:
 *    description: Server test request
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/fetch-all', verifyJwtToken, async (req, res, next) => {
    try {
        const { attr, sort = "id", order = "asc" } = req.query;
        let response = {}, args = { order: [[sort, order]] };

        if (attr) args.attributes = attr;

        response.data = await db.employees.findAll(args);

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /employee/create:
 *  get:
 *    description: Server test request
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/create', async (req, res, next) => {
    try {
        const employee = req.body;
        let response = {};

        const newEmployee = await db.employees.create(employee);
        response.data = newEmployee;

        response.jwtToken = await generateJwtToken(newEmployee);

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /employee/fetch-one/:id:
 *  get:
 *    description: Server test request
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/fetch-one/:id', verifyJwtToken, async (req, res, next) => {
    try {
        const { attr } = req.query;
        const { id } = req.params;

        let response = {}, args = { where: { id } };

        if (attr) args.attributes = attr;

        response.data = await db.employees.findOne(args);
        res.status(200).json(employee);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
