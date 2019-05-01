const express = require('express')
const Router = express.Router()
const admin = require('../controllers/admin_controller');

Router.post('/register', admin.Register);
Router.get('/activate', admin.Activate)
Router.get('/login', admin.Login)

module.exports = Router