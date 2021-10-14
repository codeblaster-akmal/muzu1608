const router = require('express').Router();
const passport = require('passport');

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), (req, res, next) => {
    try {
        res.status(200).send('<h2>Google successfully redirect callback URL!</h2>');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
