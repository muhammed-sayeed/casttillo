const express = require('express')
const logger = require('morgan')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const http = require('http')
const session = require('express-session')
const multer = require('multer')
const nocache = require('nocache')
const flash = require('connect-flash')
const cart = require("./model/cart")
const AppError = require('./apperror')
const globelErrorHandler = require('./controller/errorcontroller')

const filestorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/imagess')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g,'-')+ file.originalname)
    }
});


const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/png' || file.mimetype ==='image.jpg' || file.mimetype ==='image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
   
}

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.set('views',path.join(__dirname,"views"))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))
// app.use(express.static(path.resolve('./public')))



// app.use(express.static(__dirname+'/public/admin'))





app.use(session({
    secret:"sessionkey",
    resave : false,
    saveUninitialized:true,
    cookie:{maxAge:6000000}
}))

app.use(nocache())

app.use(express.json())

app.use(logger('dev'))

app.use(flash(

)
    )

const userRouter = require('./routes/userroutes')
const adminRouter = require('./routes/adminroutes')
const user = require('./model/usermodel')

app.use(express.urlencoded({ extended: false }));
app.use(multer({storage : filestorage,fileFilter:fileFilter}).fields([{name:"image",maxCount:2}]))

app.use((req,res,next)=>{
    if(req.session.login){
const id = req.session.login._id

 cart.findOne({owner:id}).then((data)=>{
         const length = data?.items?.length
         req.count=length
         req.User = true
         next()
 })
    }else{
        next()
    }
})

app.use('/',userRouter)
app.use('/admin',adminRouter)

app.use((req,res,next)=>{
  next(new AppError(`can't find the page ${req.originalUrl} on this server!`,404))
})

app.use(globelErrorHandler)

module.exports = app
