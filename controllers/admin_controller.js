const admin_model = require('../models/admin_model')
const mailer = require('../helpers/mail')
const bcrypt = require('bcrypt')
const admin_validate = require('../validations/admin_validations')
const async = require('async')
const jwt = require("../helpers/jwt")

exports.Register = (req, res) => {
    async.waterfall([
        (next) => {
            admin_validate.Validate(req, (err) => {
                if (err) {
                    next({
                        "code": 400,
                        "message": err
                    })
                } else {

                    admin_model.findOne({"id": req.body.id}, (err, data) => {
                        if (err) {
                            next({
                                "code": 400,
                                "message": err
                            })
                        } else {
                            next(null, data)
                        }
                    })
                }
            })
        }, (data, next) => {
            if (data && (data.status === "PENDING")) {
                next({
                    "code": 400,
                    "message": "please activate your account from " + data.mail
                })
            } else if (data) {
                next({
                    "code": 400,
                    "message": "ID already exists"
                })
            } else {
                next(null)
            }
        },
        (next) => {
            admin_model.findOne({"mail": req.body.mail}, (err, data) => {
                if (err) {
                    next({
                        "code": 500,
                        "message": err
                    })
                } else if (data) {
                    next({
                        "code": 500,
                        "message": "mail id already taken"
                    })
                } else {
                    next(null)
                }
            })
        },
        (next) => {

            req.body.password = bcrypt.hashSync(req.body.password, 10);
            // let subject = ""
            // let clas
            // if (req.body.subject) {
            //     subject = req.body.subject
            // }
            // if (req.body.class) {
            //     clas = req.body.class
            // }
            var adminData = new admin_model({
                "fname": req.body.fname,
                "lname": req.body.lname,
                "name": req.body.name,
                "id": req.body.id,
                "password": req.body.password,
                "class": req.body.class,
                "subject": req.body.subject,
                "dob": req.body.dob,
                "jyear": req.body.jyear,
                "mail": req.body.mail,
                "fatname": req.body.fatname,
                "caste": req.body.caste
            })
            adminData.save((err) => {
                if (err) {
                    next({
                        "code": 500,
                        "message": err
                    })
                } else {
                    next(null)
                }
            })
        },
        (next) => {

            payload = {
                "id": req.body.id,
                "fname": req.body.fname,
                "lname": req.body.lname,
                "mail": req.body.password
            }

            const token = jwt.getSign({data: payload}, "rgukt123", {expiresIn: 60 * 60}, (token) => {
                if (token) {
                    next(null, token)
                } else {
                    next({
                        "status": 400,
                        "message": "error occured while creating token"
                    })
                }
            })
            mailer.sendingMail("admin", req.body.id, req.body.mail, token, (err, token) => {
                if (err) {
                    next({
                        "code": 500,
                        "message": err
                    })
                } else {
                    next(null, token)
                }

            })
        }
    ], (err, token) => {
        if (err) {
            res.send(err)
        } else {
            res.send(token)
        }
    })
}

exports.Activate = (req, res) => {

    params = req.query

    async.waterfall([
        (next) => {
            jwt.verify(params.token, "rgukt123", (err) => {
                if (err) {
                    next(err)
                } else {
                    next(null)
                }
            })
        },
        (next) => {
            admin_model.findOne({$and: [{"id": params.id}, {"status": "ACTIVE"}]}, (err, data) => {
                if (err) {
                    next({
                        "status": 200,
                        "message": "Your account already activated"
                    }, null)
                } else {
                    next(null)

                }
            })
        },
        (next) => {
            admin_model.findOne({$and: [{"id": params.id}, {"status": "PENDING"}]}, (err, data) => {
                if (err) {
                    next({
                        "status": 500,
                        "message": "Error occured while fetching data"
                    }, null)
                } else {
                    next(null, data)

                }
            })
        },
        (data, next) => {
            admin_model.updateOne({"id": params.id}, {$set: {"status": "ACTIVE"}}, (err, data) => {
                if (err) {
                    next({
                        "status": 500,
                        "message": "Error occured while updating data"
                    }, null)
                } else {
                    next(null, {
                        "status": 200,
                        "message": "Account activated"
                    })
                }
            })
        }
    ], (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }

    })

}

exports.Login = (req, res) => {
    async.waterfall([
            (next) => {
                admin_model.findOne({$and: [{"mail": req.body.mail}, {"status": "ACTIVE"}]}, (err, data) => {
                    if (err) {
                        next({
                            "status": 500,
                            "message": "Error while fetching the data"
                        })
                    } else {
                        next(null, data)
                    }
                })
            },
            (data, next) => {

                if (!bcrypt.compareSync(req.body.password, data.password)) {
                    next({
                        "status": 400,
                        "message": "password does not match"
                    })
                } else {
                    next(null, data)
                }
            },
            (data, next) => {
                payload = {
                    "id": data.id,
                    "fname": data.fname,
                    "lname": data.lname,
                    "mail": data.mail
                }
               jwt.getSign({"data": payload}, data.password, {expiresIn: 60 * 60}, (token)=>{
                    if(token){
                        next(null,token)
                    }
                    else {
                        next({
                            "status":400,
                            "message":"error occoured while creating token"
                        })
                    }
                })
                next(null, jwtToken)
            }
        ],
        (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.send(result)
            }
        }
    )
}

exports.Update = (req, res) => {
    token = req.headers['token']
    data = jwt.decode(token)
    async.waterfall([
            (next) => {
                admin_model.findOne({"mail": data.data.mail}, (err, data) => {
                    if (err) {
                        next({
                            "code": 500,
                            "message": err
                        })
                    } else {
                        next(null, data)
                    }
                })
            },
            (data, next) => {
                jwt.verify(token, data.password, (err, ress) => {
                    if (err) {
                        next(err)
                    } else {
                        next(null)
                    }
                })
            },
            (next) => {
                admin_model.updateOne({"mail": data.data.mail}, {$set: req.body}, (err, result) => {
                    if (err) {
                        next(err)
                    } else {
                        next(null, {
                            "status": 200,
                            "message": "Updated"
                        })
                    }
                })
            }

        ],
        (err, result) => {
            if (err) {
                res.send(err)
            } else {

                res.send(result)
            }
        })
}