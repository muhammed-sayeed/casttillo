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
router.get('/couponpage',varifyAdmin, coupon)
router.get('/addcoupon',varifyAdmin,addCoupon)
router.post('/postaddcoupon',postaddCoupon)
router.get('/bannermanage',varifyAdmin,Banner)
router.get('/addbanner',varifyAdmin,AddBanner)
router.post('/postbanner', postBanner)
router.get('/deletbanner/:id',bannerDelet)
router.get('/deletecoupon/:id',couponDelete)
router.get('/orderlist',varifyAdmin,orderList)
router.get('/changeStatus',changeStatus)
router.post('/orderproduct',productDetails)
router.get('/salereport',varifyAdmin,saleReport)
router.get('/monthreport',varifyAdmin,monthReport)
router.get('/yearreport',varifyAdmin,yearReport)

router.get('/chart1',varifyAdmin,dayChart)
router.get('/revenuechart',varifyAdmin,revnueChart)
router.get('/adminlogout',adminLogout)


module.exports = router

