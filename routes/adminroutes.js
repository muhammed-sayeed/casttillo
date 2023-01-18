const {varifyAdmin} = require('../middlewear/varifyAdmin');
const  {
    adminLogin,
    postAdmin,
    adminHome,
   
    userPage,
    block,
    unblock,
    catPage,
    addCategory,
    postaddCategory,
    deleteCategory,
    editCat,
    postEdit,
    productList,
    addProduct,
    postAddproduct,
    
    deleteProduct,
    updatePage,
    updateproduct,
    coupon,
    addCoupon,
    postaddCoupon,
    Banner,
    AddBanner,
    postBanner,
    bannerDelet,
    couponDelete,
    orderList,
    changeStatus,
    productDetails,
    saleReport,
    monthReport,
    yearReport,
    adminLogout,

    dayChart,
    revnueChart

} = require('../controller/admincontroller')
const router = require('./userroutes')


router.get('/admin',adminLogin)
router.post('/adminhome',postAdmin)
router.get('/home',varifyAdmin,adminHome)

router.get('/userpage',varifyAdmin,userPage)
router.get('/block/:id',varifyAdmin,block)
router.get('/unblock/:id',varifyAdmin,unblock)
router.get('/catpage',varifyAdmin,catPage)
router.get('/addcat',varifyAdmin,addCategory)
router.post('/add',varifyAdmin,postaddCategory)
router.get('/delcategory/:id',varifyAdmin,deleteCategory)
router.get('/editcategory',varifyAdmin,editCat)
router.post('/updatecategory/:id',varifyAdmin,postEdit)
router.get('/productlist',varifyAdmin,productList)
router.get('/addproduct',varifyAdmin,addProduct)
router.post('/postaddproduct',varifyAdmin,postAddproduct)
router.get('/deletproduct/:id',varifyAdmin,deleteProduct)
router.get('/updatepage/:id',varifyAdmin,updatePage)
router.post('/updateproduct/:id',varifyAdmin,updateproduct)
router.get('/couponpage', coupon)
router.get('/addcoupon',addCoupon)
router.post('/postaddcoupon',postaddCoupon)
router.get('/bannermanage',Banner)
router.get('/addbanner',AddBanner)
router.post('/postbanner', postBanner)
router.get('/deletbanner/:id',bannerDelet)
router.get('/deletecoupon/:id',couponDelete)
router.get('/orderlist',orderList)
router.get('/changeStatus',changeStatus)
router.post('/orderproduct',productDetails)
router.get('/salereport',saleReport)
router.get('/monthreport',monthReport)
router.get('/yearreport',yearReport)

router.get('/chart1',dayChart)
router.get('/revenuechart',revnueChart)
router.get('/adminlogout',adminLogout)


module.exports = router

