const express = require('express');
const { check } = require('express-validator');
const { signout, signin, signup, isSignedIn } = require('../controllers/auth');
const router = express.Router();

router.post('/signup',[
    check('name').isLength({min: 1}).withMessage('Name required'),
    check('email').isEmail().withMessage('Invallid Email'),
    check('password').isLength({min: 1}).withMessage('password required')
], signup);

router.post('/signin', [
    check('email').trim().isEmail().withMessage('Invallid Email'),
    check('password').trim().isLength({ min: 1 }).withMessage('password required')
], signin);

router.get('/signout', signout);


module.exports = router;
