const nodemailer = require('nodemailer')
//
exports.validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

exports.sendingMail = (role, id, mail, token, cb) => {

    console.log("enter main func")
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '@gmail.com',
            pass: ''
        },
        secure: false,
        tls: {rejectUnauthorized: false},
        debug: true
    });

    const url = "http://localhost:8000"
    const text = `
Hi,
Thank you for choosing me!
You are just one click away from completing your account registration.

Confirm your email:\n
${url}/${role}/activate?token=${token}&id=${id}
`
    cb(null, text)
    //
    // var mailOptions = {
    //     from: "prashanthjangam1@gmail.com",
    //     to: mail,
    //     text: text,
    //     subject: 'Please complete your registration',
    // }
    // console.log("done mailer options")
    // console.log(transporter)
    // transporter.sendMail(mailOptions, function (error, info) {
    //
    //     if (error) {
    //         console.log(error);
    //         cb(error)
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //         cb(nil)
    //     }
    // });
}

// const sgMail = require('@sendgrid/mail')
// exports.sendingMail = (id, mail, token) => {
//
//     console.log(id, mail)
//     sgMail.setApiKey("");
//     console.log("api key set")
//     const msg = {
//         to: mail,
//         from: 'prashanthjangam1@gmail.com',
//         subject: 'Sending with SendGrid is Fun',
//         text: 'and easy to do anywhere, even with Node.js',
//         html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     };
//     console.log("msg", msg)
//     sgMail.send(msg);
//     console.log("sending done...")
// }
