const teacher_model = require('../models/teacher_model')
const mailer = require('../helpers/mail')
const bcrypt = require('bcrypt')
const teacher_validate = require('../validations/teacher_validations')
const async = require('async')
const jwt = require("jsonwebtoken")

exports.Register = (req, res) => {
    async.waterfall([
        (next) => {
            teacher_validate.Validate(req, (err) => {
                if (err) {
                    next({
                        "code": 400,
                        "message": err
                    })
                } else {

                    teacher_model.findOne({"id": req.body.id}, (err, data) => {
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
            teacher_model.findOne({"mail": req.body.mail}, (err, data) => {
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

            password = bcrypt.hash(req.body.password, 100)

            var teacherData = new teacher_model({
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

            payload = {
                "id": req.body.id,
                "fname": req.body.fname,
                "lname": req.body.lname,
                "mail": req.body.password
            }

            const token = jwt.sign({data: payload}, "rgukt123", {expiresIn: 60 * 60})

            teacherData.save((err) => {
                if (err) {
                    next({
                        "code": 500,
                        "message": err
                    })
                } else {
                    next(null, token)
                }
            })
        },
        (token, next) => {

            mailer.sendingMail("teacher",req.body.id, req.body.mail, token, (err, token) => {
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
            jwt.verify(params.token, "rgukt123", (err, _) => {
                if (err) {
                    next(err, null)
                } else {
                    next(null)
                }
            })
        },
        (next) => {
            teacher_model.findOne({$and: [{"id": params.id}, {"status": "ACTIVE"}]}, (err, data) => {
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
            teacher_model.findOne({$and: [{"id": params.id}, {"status": "PENDING"}]}, (err, data) => {
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
            teacher_model.updateOne({"id": params.id}, {$set: {"status": "ACTIVE"}}, (err, data) => {
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