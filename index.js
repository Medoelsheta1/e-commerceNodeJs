const express = require('express')
const app = express()
require('dotenv').config()
const {usersRouter} = require('./routers/usersRouter')
const {productsRouter} = require('./routers/productsRouter')
const  mongoose  = require('mongoose')
const cors = require('cors')
// const multer = require('multer')
const url = process.env.PUBLIC_URL

// const upload = multer(); // config
// app.use(upload.any());


const path = require('path')
app.use('/uploads' , express.static(path.join(__dirname , 'uploads')))


app.use(express.json())
app.use(cors())
app.use('/' , productsRouter)
app.use('/' , usersRouter)
app.all('*' , (req , res) => res.status(404).json({status: 'Error' , message: "Invalid Url"}))
app.use((error , req , res) => {
    res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
    })
})
mongoose.connect(url).then(() => {
    console.log("connecting succcessfully to the server")
})


app.listen('5000' , () => {
    console.log('lisening successfully on port 5000')
})