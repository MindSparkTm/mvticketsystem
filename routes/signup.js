var express = require('express');
var router = express.Router();
var User = require('../models/usermodel')


router.get('/signup',function (req,res,next) {

    res.render('signup')

})

/* GET users listing. */
router.post('/signup', function(req, res, next) {



    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        console.log('Entered here ')
        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,

        }
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
            if (err) {
                console.log('error',err)
                res.end('{"response": "error"}')
            } else {
                res.end('{"response":"success"}');
            }
        });
    }
    else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            console.log(error,user)

            if (error || !user) {
                console.log(error,user)
                var err = new Error('Wrong email or password.');
                res.end('{"response": "Wrong email or password}')
                return next(err);
            } else {
                req.session.userId = user._id;
                req.session.username = user.username
                req.session.email = user.email

                res.end('{"response": "success"}')


            }
        });
    }
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        console.log('session',req.session)
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/support/login');
            }
        });
    }
});

module.exports = router;
