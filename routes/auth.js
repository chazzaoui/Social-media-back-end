const express = require('express')
const {body} = require('express-validator')

const router = express.Router();
const authController = require('../controllers/auth');
const User = require('../models/user');

router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, {req}) => {
        return User.findOne({email: value})
        .then(userDoc => {
            if (userDoc){
                return Promise.reject('E-mail already exists!')
            }
        })
    }).normalizeEmail(),
    body('password')
    .trim()
    .isLength({min: 5}),
    body('name')
    .trim()
    .notEmpty()
], authController.createUser)

module.expors = router;