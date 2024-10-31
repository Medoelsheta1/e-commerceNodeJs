const mongoose = require('mongoose')
const product = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {type: Array , required: true},
    category: {
        type: String,
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
    },
    sizes: [{
        XXL: {
            type: Number
        },
        S: {
            type: Number
        },
        M: {
            type: Number
        },
        XL: {
            type: Number
        },
        L: {
            type: Number
        }
    }
    ]
})

module.exports = mongoose.model('product' , product)