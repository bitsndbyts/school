const express = require('express')
const bodyParser = require('body-parser');
let student_routes = require('./routes/student_routes');
let teacher_routes = require('./routes/teachers_routes')
let admin_routes = require('./routes/admin_routes')

app = express()
var http = require('http')
var server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/student', student_routes)
app.use('/teacher', teacher_routes)
app.use('/admin', admin_routes)

server.listen(8000, () => {
    console.log('server is running on port 8000')
})

app.get('/', (req, res) => {
    res.sendFile('/home/bits/Desktop/school/backend/index.html');
})

module.exports = {server, app}