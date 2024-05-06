const mongoose = require('mongoose')

const OwnerSchema = new mongoose.Schema({
    username: String,
    address: String,
    contactNo: String,
    email: String,
    password: String,
    billImage: String,
    question: String,
    answer: String,
    adharImage: String,
    gender: String,
    active: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const OwnerModel = mongoose.model("Owner", OwnerSchema)
module.exports = OwnerModel