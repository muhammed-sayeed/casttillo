const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        unique:true
    },
    image : {
        type : String,
       
    },
    description : {
        type : String,
       
    }

})


const category = mongoose.model('category',categorySchema);
module.exports = category