const express = require('express')
const Router = express.Router()
const student = require('../controllers/student_controller');

Router.post('/register',student.Register);
Router.get('/activate',student.Activate)
Router.post('/login',student.Login)
Router.put('/update',student.Update)

module.exports = Router