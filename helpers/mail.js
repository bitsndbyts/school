const nodemailer = require('nodemailer')
//
exports.validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

const sgMail = require('@sendgrid/mail')
exports.sendingMail = (role, id, mail,token) => {

    const url = "http://localhost:8000"
   
    const text = `
Hi,
Thank you for choosing me!
You are just one click away from completing your account registration.
Confirm your email:\n
${url}/${role}/activate?token=${token}&id=${id}`

    console.log(id, mail)
    sgMail.setApiKey("");
    console.log("api key set")
    const msg = {
        to: mail,
        from: 'prashanthjangam1@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: text
    };
    console.log("msg", msg)
    sgMail.send(msg)
    console.log("sending done...")
    
}
