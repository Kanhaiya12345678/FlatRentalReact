const mongoose =require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    address: String,
    contactNo: String,
    email: String,
    password: String,
    aadharNo: String,
    question: String,
    answer: String,
    adharImage: String,
    gender: String,
    active: {
        type: Boolean,
        default: true, // Default value set to false
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel