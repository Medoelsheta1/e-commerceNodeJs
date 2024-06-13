const product = require('../schemas/product')
const category = require('../schemas/cagtegory')
const order = require('../schemas/order')
const asyncWraper = require('../middleWares/asyncWrapper')
const stripe = require('stripe')('sk_test_51N132CL9jMBsnbunMtkjM50zpzNAUmIa0CFcAuRDZgnaYgp2m65j30WdT1ykfzUUDoOpULDYQgCR5ohixKkccRFO00f7sXYj7t')
const getAllProducts = asyncWraper( async (req , res , next) => {

    const limits = req.query.limit || 50
    const page = req.query.page || 1
    const kind = req.query.kind
    const category = req.query.category
    const order = req?.query?.order || "asc"
    const priceFilter = req?.query?.priceFilter || 1000
    
    let products;
    if (kind) {
        products = await product.find( category ? {kind: kind ,"category": category} : {kind: kind}).limit(limits).skip((page - 1) * limits).sort([['price', order]]).where('price').lte(priceFilter)
    }else {
        products = await product.find( category ?  {"category": category}  :  {} ).limit(limits).skip((page - 1) * limits).sort([['price', order]]).where('price').lte(priceFilter)
    }
    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    })
})
const addStatus = asyncWraper(async (req, res , next) => {
    const id = req.params.id
    const updatedStatus = req.body.status
    const updatedOrder = await order.updateOne({_id: id} , {status: updatedStatus})
    res.status(201).json({
        status: "success",  
        data: updatedOrder
    })
})
const getTrendingProducts = asyncWraper(async (req, res , next) => {
    const products = await product.find({"isTrending": true})
    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    })
})

const getSingleProduct =asyncWraper( async (req , res , next) => {
    const productId = req.params.productId
    const choosenProduct = await product.findById(productId)
    if(choosenProduct) {

        res.status(200).json({
            status: 'success',
            data: {
                choosenProduct
            }
        })
    }else {
        const err = new Error()
        err.statusCode = 404
        err.message = "invalid Id"
        next(err)
    }
})
const getProductsFromSearch = asyncWraper(async(req , res ) => {
    const searchKey = req.params.searchKey
    const order = req?.query?.order || "asc"
    const priceFilter = req?.query?.priceFilter || 1000
    console.log(order , "order")
    const regex = new RegExp(searchKey , 'i')
    const products = await product.find({"name": {$regex: regex}}).sort([['price', order]]).where('price').lte(priceFilter)
    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    })
})
const getCategories = asyncWraper(async (req, res , next) => {
    const categories = await category.find({})
    res.status(200).json({
        status: 'success',
        data: {
            categories
        }
    })
})
const addProduct = asyncWraper ( async (req , res , next) => {
    const {name , category , price , kind , description} = req.body
    
    const newProduct = new product({
        name,
        category,
        price,
        description,
        kind,
        images: [
            {
                url: req.urls[0].url
            }, 
            {
                url: req.urls[1].url
            }
        ]
    });
    await newProduct.save()
    res.status(201).json({
        status: 'success',
        data: {
            newProduct
        }
    })
})
const updateProduct =asyncWraper ( async (req , res , next) => {
    const productId = req.params.productId
    const updatedProduct = await product.updateOne({_id:productId} , {$set: {...req.body}})
    res.status(200).json({
        status: "success" , 
        data: {
            updatedProduct
        }
    })

})
const deleteProduct =asyncWraper( async (req , res , next) => {
    const productId = req.params.productId
    await product.deleteOne({_id:productId})
    res.status(200).json({
        status: 'success',
        data: null
    })
})
const addOrders = asyncWraper(async(req , res ) => {
    const newOrder = new order(req.body)
    await newOrder.save()
    res.status(201).json({
        status: 'success',
        data: {
            newOrder
        }
    })
})
const getBrandProducts = asyncWraper(async(req, res) => {
    const brandName = req.params.kind
    const products = await product.find({"kind": brandName })
    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    })
})
const getOrders = asyncWraper(async(req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const orders = await order.find({}).limit(limit).skip((page - 1) * limit)
    res.json({
        status: "success",
        data: {
            orders
        }
    })
})
const getOrder = asyncWraper(async(req, res) => {
    const id = req.params.id
    const choosenOrder = await order.findById(id)
    res.json({
        status: "success",
        data: {
            choosenOrder
        }
    })
})
const payment = asyncWraper(async(req, res) => {
    console.log(req.body.products)
    const line_items = req.body.products.map((ele) => {
        return {
            price_data:  {
                currency: "usd",
                product_data: {
                    name: ele.name,
                    images: [ele.images[0].url]
                },
                
                unit_amount: ele.price * 100
            },
            quantity: ele.quantaty,
        }
    })
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],

            line_items: line_items,
            billing_address_collection: 'required',
            shipping_address_collection: {
            allowed_countries: ['US' , 'EG' , 'CA'],
            },
            phone_number_collection: {
                enabled: true
            },
            mode: 'payment',
            success_url: `https://medoelsheta1.github.io/checkout-success`,
            cancel_url: `https://medoelsheta1.github.io/checkout-fail`,
        });
        res.json({url: session.url});
        });



module.exports = {  
    getAllProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getTrendingProducts,
    getCategories,
    getProductsFromSearch,
    addOrders,
    getOrders,
    getOrder,
    addStatus,
    payment,
    getBrandProducts
}