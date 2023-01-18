const moongoose = require('mongoose')
const addresSchema = new moongoose.Schema({
    user :{
        type: moongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    address : [{
        name:{
            type:String,
            max:20
        },
        phone:{
            type:Number
        },
        state:{
            type:String
        },
        city:{
            type:String
        },
      
        
        address:{
            type:String
        },
        pin:{
            type:Number
        }
    }]
})

const address = moongoose.model('address',addresSchema)
module.exports = address