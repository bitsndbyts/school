const mailer = require('../helpers/mail')
exports.Validate = (req, cb) => {
    if (!req.body.fname || !req.body.lname || !req.body.name) {
        cb("All name feilds are require")
    } else if (!req.body.id) {
        cb("id is require")
    } else if (!req.body.password) {
        cb("password is require")
    } else if (!req.body.class) {
        cb("class is require")
    } else if (!req.body.dob) {
        cb("dob is require")
    } else if (!req.body.jyear) {
        cb("jyear is require")
    } else if (!req.body.mail) {
        cb("mail is require")
    } else if (!req.body.fatname) {
        cb("pfatname is require")
    } else if (!req.body.caste) {
        cb("caste is require")
    } else if (!mailer.validateEmail(req.body.mail)) {
        cb("mail format is incorrect")
    } else {
        cb(null)
    }
}