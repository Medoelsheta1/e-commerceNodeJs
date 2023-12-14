module.exports = (role) => {
    return (req , res , next) => {
        const isValid = role === req.userData.role
        if (isValid) {
            next()
        }else {
            res.status(401).json({status: "Error" , message: "Un Authorized for User" , data: null})
        }
    }
}