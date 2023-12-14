const mongoose = require('mongoose')

const user = mongoose.Schema({
    firstName: {
        type: String,
        required: [true , "You must type your first name"]
    },
    lastName: {
        type: String,
        required: [true , "You must type your last name"]
    },
    email: {
        type: String,
        required: [true , "You must type your Email"],
        unique: true,
        validate: {
            validator: (value) => value.includes("@"),
            message: "This not a valid Email"
        }
    },
    password: {
        type: String,
        required: [true , "You can't leave password empty"]
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: ["USER"],
        default: "USER"
    },
    avatar: {
        type: String,
        default: 'profiler.webp'
    }

})
module.exports = mongoose.model('user' , user)