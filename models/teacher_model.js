const mongoose = require("../mongo/mongo")

let TeacherDetails = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    class: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
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

module.exports = mongoose.model("teachers", TeacherDetails)