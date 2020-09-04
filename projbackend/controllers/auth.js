const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            err: errors.errors.map(error => error.msg)
        });
    }

    let user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.json({err: 'Email already exists'});
        }
        return res.json(user);
    });
}

exports.signin = (req, res) => {
    let { email, password } = req.body;
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            err: errors.errors.map(error => error.msg)
        });
    }
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({err: ['User not found']});
        }
        if(!user.authenticate(password)) {
            return res.status(400).json({ err: ['incorrect password'] });
        }
        let token = jwt.sign({ id: user._id }, process.env.SECRET);
        // setting token into cookie
        res.cookie('token', token, {expire: new Date() + 99999});
        //setting token into header
        // res.header('token', token);
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });

}

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({msg: 'User signout'});
};

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: 'auth'
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && String(req.profile._id) === req.auth.id;
    if(!checker) {
        return res.status(403).json({err: 'Access Denied!'});
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json('Not admin. Access Denied!');
    }
    next();
};
