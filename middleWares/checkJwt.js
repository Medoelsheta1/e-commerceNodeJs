const jwt = require('jsonwebtoken')
module.exports = (req ,res , next) => {

    const authReq = req.headers["Authorization"] || req.headers["authorization"]
    if (!authReq) {
        return res.status(401).json({status: "Error" , code: 401 , message: "UN Authorized" , data: null})
    }
    const token = authReq.split(" ")[1]
    try {
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY)
        req.userData = decodedToken
        next()
    }catch {
        res.status(401).json({status: "Error" , code: 401 , message: "UN Authorized" , data: null})
        next()
    }
}