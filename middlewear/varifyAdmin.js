const varifyAdmin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin')
    }
}
module.exports={varifyAdmin}