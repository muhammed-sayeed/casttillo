const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    date:{
        type:Date,
    },
   userId:{
    type:String,
    ref:'user'
   },
   products:[{
    product:{
        type:String,
        ref:'product'
    },
    quantity:{
        type:Number
    },
    totalprice:{
        type:Number
    }
   }],
   subtotal:{
    type:Number
   },
   address:{
    type:String,
    ref:'address'
    
   },
   paymentmethod:{
    type:String
   },
   orderstatus:{
    type:String
   },
},{timestamps:true});

const order = mongoose.model('order',orderSchema)
module.exports = order;