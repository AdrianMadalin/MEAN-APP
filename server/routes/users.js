let express = require('express');
let router = express.Router();
let User = require('../models/user.model');
let jwt = require('jsonwebtoken');
let configDb = require('./../config/database');
let moment = require('moment');

router.post('/register', (req, res) => {
    let user = new User({
        name: req.body.username,
        password: req.body.password
    });

    User.addUser(user, (err, userAdded) => {
        if (err) {
            console.log(`Server error`, `Add new user`, `Error ${err}`);
            res.json({
                success: false,
                message: 'Fail to register new user',
                error: err
            });
        } else {
            console.log(userAdded);
            res.json({
                success: true,
                message: 'User registered',
                user: userAdded
            });
        }
    });
});

router.post('/login', (req, res) => {
    console.log(req.body);
    User.findOne({name: req.body.name}, (err, user) => {
        if (err) {
            console.log(`Server error`, `Finding user in database`, `Error ${err}`);
            return res.json({
                success: false,
                message: 'Error finding the user',
                error: err
            });
        } else if (!user) {
            console.log(`Server error`, `Finding user in database`, `Error ${err}`);
            return res.json({
                success: false,
                message: 'Fail to find the user in the database',
                error: err
            });
        } else {
            User.comparePassword(req.body.password, user.password, (err, isMatched) => {
                console.log(user.password);
                if (err) {
                    console.log(`Server error`, `Comparing the passwords`, `Error ${err}`);
                    return res.json({
                        success: false,
                        message: 'Error Comparing the passwords',
                        error: err
                    });
                } else {
                    if (isMatched) {
                        const token = jwt.sign(user.toJSON(), configDb.secret, {expiresIn: '30s'});
                        return res.json({
                            success: true,
                            token: `Bearer ${token}`,
                            user: {
                                id: user._id,
                                name: user.name,
                            }
                        });
                    } else {
                        return res.json({
                            success: false,
                            message: 'Fail to find user',
                        });
                    }
                }
            })
        }
    });
});

router.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, configDb.secret, (err, decoded) => {
        if(err){
            res.send({
                message: `Unable to decode ${err}`
            });
        } else {
            res.send({
                message: `success`,
                payload: decoded
            })
        }
    });
});

function verifyToken (req, res, next) {
    //get auth header value
    const barrerHeader = req.headers['authorization'];
//    check if barrer is undefined;
    if(typeof barrerHeader !== 'undefined'){
        //split the token
        const barrerTokenArr = barrerHeader.split(' ');
        const barrerToken = barrerTokenArr[1];
        req.token = barrerToken;
        next();
    } else {
    //    Forbidden
        res.sendStatus(403);
    }
};

module.exports = router;
