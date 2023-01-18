const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:'./.env'})
DB = process.env.DATABASE_URL

console.log(DB)

const mongoosedb = mongoose.connect(DB,{
    useNEWUrlParser: true,
    useUnifiedTopology:true
})
console.log('hiiii');

module.exports = mongoosedb
