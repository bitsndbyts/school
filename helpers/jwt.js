const jwt = require('jsonwebtoken')

exports.getSign = (payload, password, expires, cb)
{
    const token = jwt.sign(payload, password, expires)
    if (token) {
        cb(token)
    } else {
        cb(null)
    }
}

exports.verify = (params.token, "rgukt123", cb)
{

    jwt.verify(params.token, "rgukt123", (err, _) => {
        if (err) {
            cb(err)
        } else {
            cb(null)
        }
    })
}
