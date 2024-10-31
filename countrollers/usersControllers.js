const asyncWrapper = require('../middleWares/asyncWrapper')
const user = require('../schemas/users')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logIn = asyncWrapper( async (req , res , next) => {
    const {email , password} = req.body
    console.log(req.body)
    const existUser = await user.findOne({email: email})
    let matchedPassword;
    if(existUser) {
        matchedPassword = await bcrypt.compare(password , existUser.password)
    }else {
        const err = new Error()
        err.message = "This Email is not exist"
        err.status = 404
        return next(err)
    }
    if (matchedPassword) {
        
        const token = await jwt.sign({email: email , id: existUser._id , role: existUser.role} , process.env.JWT_SECRET_KEY , {expiresIn: '1h'})
        res.status(200).json({status: "success" , message: "loginSuccessfully" , data: {token , id:existUser._id , role: existUser.role , brand: existUser?.brand || "none"}})
    }else {
        const err = new Error()
        err.message = "Password is wrong"
        err.status = 404
        return next(err)
    }
})

const signUp = asyncWrapper( async (req , res , next) => {
    const {firstName , lastName , email , password , role } = req.body
    const existEmail = await user.findOne({email: email})
    if(existEmail) {
        const err = new Error()
        err.message = "user Already Exist"
        err.status = 400
        return next(err)
    }
    const hashPassword = await bcrypt.hash(password , 8)
    const newUser = new user( {
        firstName,
        lastName,
        email,
        password: hashPassword,
        role,
        avatar: req.url
    })
    
    const token = await jwt.sign({email: email , id: newUser._id , role} ,process.env.JWT_SECRET_KEY , {expiresIn: '1h'})
    newUser.token = token
    await newUser.save()
    res.status(201).json({
        status: "success",
        data: {
            newUser
        },
        message: "create User Successfully" 
    })
}) 
const getAllUsers = asyncWrapper( async (req , res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const users = await user.find({} , {"__v": false}).limit(limit).skip( (page - 1) * limit)
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
})
const getUser = asyncWrapper (async (req , res , next) => {
    const userId = req.params.userId;
    const choosenUser = await user.findById(userId , {'__v': false})
    if(choosenUser) {
        res.status(200).json({
            status: "success",
            data: {
                choosenUser
            }
        })
    }else {
        const err = new Error();
        err.message = "Invalid Id"
        err.status = 404
        next(err)

    }
})

module.exports = {
    getAllUsers,
    getUser,
    logIn,
    signUp
}