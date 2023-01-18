const mongoosdb = require('./config/connection');
console.log('hiiiiiiiiiiiiiiiiiiiiii');
const app = require('./app.js');
console.log('hiiiiii');
mongoosdb.then(()=>{
            console.log('DB connected')
        })
        .catch((error)=>{
            console.log(`error in db ${error}`)
        });

        const PORT = process.env.PORT || 3000;
         app.listen(PORT,(error)=>{
            if(error){
                console.log('error raised')
            } else {
                console.log('succsessfully running')
            }
        });