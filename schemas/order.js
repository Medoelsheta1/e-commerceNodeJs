const mongoose = require("mongoose")
const order = mongoose.Schema({
    information: {
        name: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        postcode: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    order: [],
    status: {
        type: String,
        enum: ["pending" , "closed" , "open"],
        default: "open"
    }
})
module.exports = mongoose.model('order' , order)