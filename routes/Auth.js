const {check}=require('express-validator')

module.exports.signup = check('email').isEmail()