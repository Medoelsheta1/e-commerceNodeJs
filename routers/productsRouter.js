const express = require('express')
const allowedTo = require('../middleWares/allowedTo')
const productsRouter = express.Router()
const productsControllers = require('../countrollers/productsControllers')
const checkJwt = require('../middleWares/checkJwt')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
cloudinary.config({ 
  cloud_name: 'dhlgqavcx', 
  api_key: process.env.API_CLOUDNARI_KEY,
  api_secret: process.env.API_CLOUDNARI
}); 

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req , file , cb) => {
        cb(null , 'uploads')
    },
    filename: (req , file , cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null , `user-${Date.now()}.${ext}`)
    }
})
const fileFilter = (req , file , cb) => {
    const imgType = file.mimetype.split('/')[0]
    if (imgType === "image") {
        return cb(null , true)
    }else {
        const err = new Error()
        err.message = "Invaled Image File"
        return cb(err , false)
    }
}
const cloudinaryImageUploadMethod = async file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload( file , (err, res) => {
          if (err) return res.status(500).send("upload image error")
            resolve({
              url: res.secure_url
            }) 
          }
        ) 
    })
  }

const cloudImages  = async (req, res , next) => {
    if (req.files.length === 2) { 
                const urls = []
                const files = req.files        
                for (const file of files) {
                    const {path} = file
                    const url =await cloudinaryImageUploadMethod(path)
                    urls.push(url)
                    fs.unlinkSync(path)
                }
                req.urls = urls
                next();
            
        }else {
        return res.status(400).json({
            status: "Error",
            message: "Only Two immages not more not less"
        })
    }
       
    }


const upload = multer({ storage: storage , fileFilter })

productsRouter.get('/api/products' ,productsControllers.getAllProducts )
productsRouter.get('/api/products/trending' ,productsControllers.getTrendingProducts )
productsRouter.get('/api/products/:productId' ,productsControllers.getSingleProduct )
productsRouter.get('/api/categories' ,productsControllers.getCategories )
productsRouter.get('/api/orders', checkJwt , allowedTo('ADMIN')  ,productsControllers.getOrders )
productsRouter.get('/api/orders/:id', checkJwt , allowedTo('ADMIN')  ,productsControllers.getOrder )
productsRouter.post('/api/orders' ,productsControllers.addOrders )
productsRouter.post('/api/orders/updateStatus/:id',checkJwt , allowedTo('ADMIN')   ,productsControllers.addStatus )
productsRouter.get('/api/products/search/:searchKey' ,productsControllers.getProductsFromSearch )
productsRouter.post('/api/products',checkJwt , allowedTo('ADMIN') ,  upload.array('images') , cloudImages  ,productsControllers.addProduct )
productsRouter.patch('/api/products/:productId', checkJwt , allowedTo('ADMIN') , upload.array('images')   ,productsControllers.updateProduct )
productsRouter.delete('/api/products/:productId', checkJwt , allowedTo('ADMIN')  ,productsControllers.deleteProduct )
productsRouter.post('/api/create-checkout-session', checkJwt  ,productsControllers.payment )

module.exports = {
    productsRouter
}