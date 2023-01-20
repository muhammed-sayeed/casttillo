const express = require('express')
const{varifyUser} = require('../middlewear/varifyuser')
const {check,body}=require('express-validator')

const {
    homeView,
    loginView ,
    signView,
   
    postsignupView,
    postOtp,
    postloginView,
    viewMore,
    getCart,
    
    logout,
    addTocart,
    removefromcart,
    quantityChange,
    shopView ,
    profilePage,
    addAddres,
    addressDelete,
    addressEdit,
    checkoutPage,
    postCheck,
    
    cartEmpty,
    forgettPassword,
    postForgett,
    Token,
    postreset,
    orderList,
    detailPage,
    couponCheck,
    search,
    addTowish,
    wishlist,
    addCheckAddres,
    orderPrint,
    errorPage,
   
    creatorder,
    successPage,
    varifypeyment,
    removefromwish

   
} = require('../controller/usercontrller')


const router = express.Router()


router.get('/',homeView)
router.get('/login',loginView )
router.get('/signup',signView)

router.post('/signuppost',[check('email','invailed Eamil').isEmail(),body('password','invailed Password').isLength({min:5}).custom((value)=>{
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(specialChars.test(value) === false)throw new Error('Password need special charectere')
    else return true
    
}
).custom((value,{req})=>{
    if(value !== req.body.conform){
        throw new Error('Password and conform not matching !')
    }
    else return true
}),body('phone','invailed Phone Number !').isNumeric().isLength({min:10 , max:10})
],postsignupView)
router.post('/otp',postOtp)
router.post('/home',postloginView)

router.get('/logout',logout)
router.get('/productdetails/:id',viewMore)
router.get('/gotocart',varifyUser,getCart)

router.post('/addtocart/',varifyUser,addTocart)
router.delete('/removefromcart/',removefromcart)
router.patch('/qtychange/',quantityChange),
router.get('/shopview',shopView )
router.get('/profile',varifyUser,profilePage)
router.post('/addaddres',addAddres)
router.delete('/deleteaddress/:id',addressDelete)
router.post('/editaddress/:id',addressEdit)
router.get('/checkout',checkoutPage)
router.post('/success', postCheck)
router.get('/orders',orderList)
router.get('/emptycart',cartEmpty)
router.get('/password',forgettPassword)
router.post('/postforgett',postForgett)
router.get('/reset/:token',Token)
router.post('/reset',postreset)
router.get('/orderdetails',detailPage)
router.post('/couponcheckout',couponCheck)
router.post('/search',search)
router.get('/whishlist',addTowish)
router.get('/wishlistpage', wishlist)
router.post('/addcheckaddress',addCheckAddres)
router.get('/orderprint',orderPrint)
router.get('/errorpage',errorPage)

router.post('/create-order',creatorder)
router.get('/successpage',successPage)
router.post('/verifyPayment',varifypeyment)
router.delete('/removefromwish',removefromwish)







module.exports = router
   