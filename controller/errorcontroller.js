const AppError = require("../apperror");

const handleDupError = (err) =>{
    const value = error.keyValue.name
    const message = `Duplicate field value: ${value}.Please use anothor value!`
 return new AppError(message,404)
}


module.exports = (err,req,res,next)=>{
    console.log(err);
    res.status(err.statusCode || 500)
    if(err.isOperational){
        res.render('404',{
            error:{
                status:err.statusCode || 500,
                message:err.message
               
            }
    
        })
    }else{
        const error = {...err}
        if(err.name === 11000){
            err = handleDupError(err)
            res.render('404',{
                error:{
                    status:error.statusCode || 500,
                    message:error.message
                   
                }
            })
          
    
        }
        res.status(500).render('404',{
            error:{
                status:500,
                message:'We are Extremely Sorry,We are Working on it'
            }
        })
    }
  
}