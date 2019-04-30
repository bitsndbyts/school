const express = require('express')
const Router = express.Router()
const teacher = require('../controllers/teacher_controller');

Router.post('/register', teacher.Register);
Router.get('/activate', teacher.Activate)

module.exports = Router