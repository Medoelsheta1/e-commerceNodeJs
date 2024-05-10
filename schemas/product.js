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
    brandName: {
        type: String,
        required: true
    },
    allQuantity: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    sizes: [
        {
            XXL: Number
        },
        {
            XL: Number
        },
        {
            L: Number
        },
        {
            M: Number
        },
        {
            S: Number
        }
        
    ]

})

module.exports = mongoose.model('product' , product)