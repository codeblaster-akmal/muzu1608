const router = require('express').Router();
const passport = require('passport');
const db = require("../config/db");
const { verifyJwtToken } = require('../middleware/jwt');

// auth with google+
/**
 * @swagger
 * /google:
 *  get:
 *    description: Auth with google+
 */
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

/**
 * @swagger
 * /google/redirect:
 *  get:
 *    description: Callback route for google to redirect and hand control to passport to use code to grab profile info
 *    responses:
 *      '200':
 *        description: A successful response Google successfully redirect callback URL!
 */
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), (req, res, next) => {
    try {
        res.status(200).send('<h2>Google successfully redirect callback URL!</h2>');
    } catch (err) {
        next(err);
    }
});

// auth logout
/**
 * @swagger
 * /logout:
 *  post:
 *    description: Employee by sending email-id with email as key of object.
 *    responses:
 *      '200':
 *        description: A successful response get object with status Logout-successfully!
 */
router.post('/logout', verifyJwtToken, async (req, res, next) => {
    try {
        const { email } = req.body;

        await db.employee_tracks.create({ employeeEmail: email, isLoggedIn: 0 });
        res.status(200).json({ status: 'Logout-successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
