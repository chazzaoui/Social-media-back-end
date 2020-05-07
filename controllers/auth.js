
const User = require('../models/user');

const {validationResult} = require('express-validator')

exports.createUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ //means we have errors
        const error = new Error('Entered data does not meet input requirements')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
}