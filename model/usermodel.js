const mongoose = require('mongoose')


const userSchema =new mongoose.Schema({
    name : {
         type : String,
         required : true
         
    },
    phone : {
        type : Number,
        required : true
       
    },
    email : {
        type : String,
        required : true
        
    },
    password : {
        type : String,
        required : true
       
    },
    conform : {
        type : String,
        required : true
    },
    access :{
        type : Boolean,
        default:true
    },
    resetToken: String,
    resetTokenExpiration: Date
    
})

const user = mongoose.model('user',userSchema);
module.exports = user