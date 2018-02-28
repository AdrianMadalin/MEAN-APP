let express = require('express');
let router = express.Router();
let User = require('../models/user.model');
let jwt = require('jsonwebtoken');
let configDb = require('./../config/database');
let moment = require('moment');
let multer = require('multer');
let fs = require('fs');
let mongoose = require('mongoose');

let loginToken = null;
let userPayload = null;

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
                if (err) {
                    console.log(`Server error`, `Comparing the passwords`, `Error ${err}`);
                    return res.json({
                        success: false,
                        message: 'Error Comparing the passwords',
                        error: err
                    });
                } else {
                    if (isMatched) {
                        const token = jwt.sign(user.toJSON(), configDb.secret, {expiresIn: '1h'});
                        loginToken = token;
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

/*
router.post('/profile/user', checkToken, verifyTokenDate, uploadM, (req, res) => {
    if (req.file !== undefined) {
        const id = mongoose.Types.ObjectId(userPayload._id);
        User.findById(id).exec().then(
            (user) => {
                user.imgPath = req.file.path;
                user.save((err) => {
                    if (err) {
                        res.json({message: 'false', error: err})
                    } else {
                        res.send({message: 'success', user})
                    }
                })
            }
        )
    }
});

function checkToken(req, res, next) {
    if (loginToken !== null) {
        req.token = loginToken;
        next();
    } else {
        //    Forbidden
        res.sendStatus(403);
    }
};

function verifyTokenDate(req, res, next) {
    jwt.verify(req.token, configDb.secret, (err, decoded) => {
        if (err) {
            res.send({
                message: `Unable to decode ${err}`
            });
        } else {
            userPayload = decoded;
            res.send({
                message: `success`,
                payload: decoded
            });
            next();
        }
    });
}

function uploadM(req, res, next) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        // reject a file
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const upload = multer({
        storage: storage,
        fileFilter
    }).single('image');

    upload(req, res, (err) => {
        if (err) {
            res.status(501).send(`Error`, {message: `error from multer`});
        } else {
            if (req.file !== undefined) {
                console.log(req.body.hobby);
                console.log(req.file);
                next();
            } else {
                res.send({message: `not uploaded`}).status(501);
            }
        }
    })
}
*/


router.post('/profile/user', checkToken, (req, res) => {
    jwt.verify(req.token, configDb.secret, (err, decoded) => {
        if (err) {
            res.send({
                message: `Unable to decode ${err}`
            });
        } else {
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'public/images');
                },
                filename: function (req, file, cb) {
                    cb(null, file.originalname);
                }
            });

            const fileFilter = (req, file, cb) => {
                // reject a file
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            };

            const upload = multer({
                storage: storage,
                fileFilter
            }).single('image');

            upload(req, res, (err) => {
                if (err) {
                    res.status(501).send(`Error`, {message: `error from multer`});
                } else {
                    if (req.file !== undefined) {
                        console.log(req.body.hobby);
                        console.log(req.file);
                        res.send({
                            message: `success`,
                            payload: decoded,
                            file: req.file
                        });

                    } else {
                        res.send({message: `not uploaded`}).status(501);
                    }
                }
            })

        }
    });
});


function checkToken(req, res, next) {
    if (loginToken !== null) {
        req.token = loginToken;
        next();
    } else {
        //    Forbidden
        res.sendStatus(403);
    }
};


module.exports = router;
