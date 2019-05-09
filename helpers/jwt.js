const jwt = require('jsonwebtoken')

exports.getSign = (payload, password, expires, cb) => {
    const token = jwt.sign({"data":payload}, password, expires)
    if (token) {
        cb(token)
    } else {
        cb(null)
    }
}

exports.verify = (token, psw, cb) => {
    jwt.verify(params.token, psw, (err, _) => {
        if (err) {
            cb(err)
        } else {
            cb(null)
        }
    })
}

exports.decode = (token, cb) =>{
    data= jwt.decode(token)
    if(token){
        cb(data)
    }else{
        cb(null)
    }
}
