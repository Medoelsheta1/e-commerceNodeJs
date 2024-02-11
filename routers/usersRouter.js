const express = require('express')
const usersRouter = express.Router()
const usersControllers = require('../countrollers/usersControllers')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
cloudinary.config({ 
    cloud_name: 'dhlgqavcx', 
    api_key: process.env.API_CLOUDNARI_KEY,
    api_secret: process.env.API_CLOUDNARI
});
const checkJwt = require('../middleWares/checkJwt')
const allowedTo = require('../middleWares/allowedTo')
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
function cloudImage(req, res , next) {
    cloudinary.uploader.upload(req.file.path, (err , res) => { 
        req.url = res.url
        fs.unlinkSync(req.file.path)
            next()
     });
     


}

const upload = multer({ storage: storage , fileFilter })

usersRouter.get('/api/users', checkJwt , allowedTo('ADMIN')  , usersControllers.getAllUsers)
usersRouter.get('/api/users/:userId' , usersControllers.getUser)
usersRouter.post('/api/logIn' , usersControllers.logIn)
usersRouter.post('/api/signUp', upload.single('avatar') , cloudImage , usersControllers.signUp)

module.exports = {usersRouter}