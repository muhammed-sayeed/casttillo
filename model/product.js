const mongoose = require('mongoose')

const productschema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    brand : {
        type:String
    },
    price : {
        type:Number
    },
    stock :{
        type:Number
    },
    category :{
        type:String,
        ref:"category",
        required:[true,"Atleast one category need"]
    },
    image : {
        type:Array,
        required:true
    },
    description :{
        type:String,
        max:100,
    },
    discount:{
        type:String,
    },
    size:{
        type:String
    }
    }
)

const product = mongoose.model('product',productschema);
module.exports = product