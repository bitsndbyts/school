const mongoose = require("../mongo/mongo.js")

const AdminDetails = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    class: {
        type: Number
    },
    subject: {
        type: String
    },
    dob: {
        type: Date,
        required: true
    },
    jyear: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    fatname: {
        type: String,
        required: true
    },
    caste: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "PENDING"
    }

})

module.exports = mongoose.model("admins", AdminDetails)