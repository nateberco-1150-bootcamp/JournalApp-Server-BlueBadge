let express = require('express');
let router = express.Router();
//above could be
//const router = require('express').Router();
let sequelize = require('../db')
let User = sequelize.import('../models/user.js');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

//refactor version
// const router = require('express').Router();
// const User = require('../db').import('../models/user.js');

//Create a new endpoint : /create
/* ******************
****** USER SIGNUP *********
********************** */



router.post('/create', function(req, res){
    //have an object that matches the model of UserTable (email/password).
    let userModel = {
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 13)
    };
    User.create(userModel).then(
        function createSuccess(user){
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24 });
        
        res.json({
            user: user,
            message: "User successfully created",
            sessionToken: token,
        });
    })
    .catch(function (err) {
        res.status(500).json({ error: err});
        
/* FAT ARROW
    .catch(err => res.status(500).json({ error: err }))
*/

    });
});


/* *********************
****** User Sign In ****
********************** */

router.post('/login', function (req, res){
    User.findOne({
        where: {
            email: req.body.user.email
        }
    }).then(
        function loginSuccess(user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, function (err, matches){
                    if (matches) {
                    let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24 })
                    res.status(200).json({ 
                    user: user,
                    message: "User successfully logged in!",
                    sessionToken: token 
                }) 
            } else {
                res.status(502).send({ error: "Login Failed" });
                }
            });
        } else {
                res.status(500).json({ error: 'User does not exist.'})
            } 
        })        
        
    .catch(function (err) {
        res.status(500).json({ error: err });
    });
});

module.exports = router;
