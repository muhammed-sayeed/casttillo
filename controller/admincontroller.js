const user = require("../model/usermodel");
const Admindb = require("../model/category");
const category = require("../model/category");
const mongoose = require("mongoose");
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;
const product = require("../model/product");
const Productdb = require("../model/product");
const coupondb = require("../model/coupon");
const banner = require("../model/banner");
const orderdb = require("../model/order");
const addressdb = require("../model/address");
const order = require("../model/order");

const adminLogin = (req, res) => {
  res.render("admin/adminlogin");
};

const postAdmin = (req, res) => {
  const admin = req.body.email;
  const password = req.body.password;
 

  if (admin === adminEmail && password === adminPassword) {
   
    req.session.admin = true;
    res.redirect("admin/home");
  } else {
   
    res.redirect("/admin");
  }
};

const adminHome = async(req, res) => {

  let admin = null;
  if(req.session.admin){
    admin = req.session.admin
  }
  const revenue = await orderdb.aggregate([{$match:{ $or: [{ $and: [{paymentmethod: 'cod',orderstatus:'delivered'}]},{ $and: [{paymentmethod: 'razorpay', orderstatus: 'placed'}]}]}},
{
  $group:{
    _id:{
      id:null
    },
    totalprice: {$sum: '$subtotal'},
    items:{$sum: { $size: '$products'}},
    count:{$sum:1}
  }
}
])

console.log(revenue,'ertyuiuytrtytrtytrt');

const Allsales = await orderdb.aggregate([{ $match: { orderstatus: { $ne: 'cancelled'}}},{
$group:{
  _id: {
    id:null
  },
  totalprice: {$sum: '$subtotal'},
  items:{$sum: { $size: '$products'}},
  count:{$sum:1}
}
}
])

const date = new Date()
let month = date.getMonth()
month = month+1
const year = date.getFullYear()
const day =date.getDate()

const TodayRevenue = await orderdb.aggregate([{ $match: { $or: [{ $and: [{ paymentmethod:'cod', orderstatus: 'delivered'}]},{$and: [{paymentmethod: 'razorpay', orderstatus: 'placed'}]}]}},
  {
  $addFields: {Day: {$dayOfMonth: '$createdAt'},Month: {$month: '$createdAt'}, Year:{$year:'$createdAt'}}
 },
 {
  $match: {Day:day,Year:year,Month:month}
 },
 {
  $group:{
    _id: {
      day: { $dayOfMonth: '$createdAt'}
    },
    totalprice: {$sum: '$subtotal'},
    count: {$sum: 1}
  }
 }
])

const TodaySale = await orderdb.aggregate([{ $match: {orderstatus: {$ne: 'cancelled'}}},
{
  $addFields: {Day: {$dayOfMonth: '$createdAt'},Month: {$month: '$createdAt'}, Year:{$year:'$createdAt'}}
 },
 {
  $match: {Day:day,Year:year,Month:month}
 },
 {
  $group: {
    _id:{
      day:{$dayOfMonth: '$createdAt'}
    },
    totalprice: {$sum: '$subtotal'},
    items:{$sum: { $size: '$products'}},
    count:{$sum:1}
  }
 }
])



  res.render("admin/adminhome",{revenue,Allsales,TodayRevenue,TodaySale});
};

const adminLogout =(req,res)=>{
  req.session.admin = null;
  res.render('admin/adminlogin')
}

const userPage = async (req, res) => {
  const userlist = await user.find();
 
  res.render("admin/userpage", { userlist });
};

const block = async (req, res) => {
 
  const id = req.params.id;
  await user.findByIdAndUpdate(id, { access: false });
  res.redirect("/admin/userpage");
};

const unblock = async (req, res) => {
  const _id = req.params.id;
 
  await user.findByIdAndUpdate(_id, { access: true });
  res.redirect("/admin/userpage");
};

const catPage = async (req, res) => {
  const categorylist = await category.find();
  console.log(categorylist);
  
  res.render("admin/catpage", { categorylist });
};

const addCategory = (req, res) => {
  res.render("admin/addcat");
};

const postaddCategory = (req, res) => {
 
  const image = req.files.image;
  let imageUrl = image[0].path;
  imageUrl = imageUrl.substring(6);
 
  if (!image) {
    res.redirect("/admin/addcat");
  }
 
  const category1 = new Admindb({
    name: req.body.name,
    image: imageUrl,
    description: req.body.description,
  });
  category1.save((err, doc) => {
    if (err) console.log(err);
    else {
      console.log(doc);
      res.redirect("/admin/catpage");
    }
  });
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  console.log("deleting");
  console.log(id);
  await category
    .findByIdAndDelete({ _id: id })
    .then((doc) => {
      console.log(doc);
      res.redirect("/admin/catpage");
    })
    .catch((err) => console.log(err));
};

const editCat = async (req, res) => {
 
  const delid = req.params.id;
  
  const onUser = await category.findOne({ _id: delid });
 
  res.render("admin/editcategory", { onUser });
};

const postEdit = async (req, res) => {

  const id = req.params.id;
 
  const updateName = req.body.categoryname;
  const updatedescription = req.body.description;
  const updateimage = req.file;
 

  let cat = { name: updateName, description: updatedescription };
  if (updateimage) {
    let imageUrl = updateimage.path;
    cat.image = imageUrl.substring(6);
  }
 
  await category.updateOne(
    { _id: id },
    {
      $set: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
    }
  );
  res.redirect("/admin/catpage");
};

const productList = async (req, res) => {
  const productlist = await product.find().populate("category");
 
  res.render("admin/product", { productlist });
};

const addProduct = async (req, res) => {
  const categories = await category.find();
  res.render("admin/addproduct", { categories });
};

const postAddproduct = (req, res) => {
 
  const image = req.files.image;
 
  let img = [];
  image.forEach((el, i, arr) => {
    img.push(arr[i].path.substring(6));
  });

 
  const product1 = new Productdb({
    name: req.body.name,
    brand: req.body.brand,
    stock: req.body.stock,
    price: req.body.price,
    discount: req.body.discount,
    size: req.body.size,
    category: req.body.category,
    image: img,
    description: req.body.description,
  });
  product1.save((err, doc) => {
    if (err) {
      console.log(err);
      res.redirect("admin/addproduct");
    } else {
      console.log(doc);
      res.redirect("/admin/productlist");
    }
  });
};

const deleteProduct = (req, res) => {
  const id = req.params.id;
 
  product
    .findByIdAndDelete({ _id: id })
    .then((doc) => {
      console.log(doc);
      res.redirect("/admin/productlist");
    })
    .catch((err) => {
      console.log(err);
    });
};

const updatePage = async (req, res) => {
  const updateid = req.params.id;
 
  const categories = await category.find();
  const onUser = await product.findOne({ _id: updateid });
 
  res.render("admin/updateproduct", { categories, onUser });
};

const updateproduct = async (req, res) => {

  const id = req.params.id;
 
  const image = req.files.image;
  const pro = {
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
    description: req.body.description,
    discount: req.body.discount,
    size: req.body.size,
  };
  if (image) {
    img = [];
    image.forEach((el, i, arr) => {
      img.push(arr[i].path.substring(6));
    });
    const productz = await product.updateOne(
      { _id: id },
      {
        $set: {
          name: pro.name,
          brand: pro.brand,
          price: pro.price,
          stock: pro.stock,
          category: pro.category,
          image: img,
          description: pro.description,
          discount: pro.discount,
          size: pro.size,
        },
      }
    );
  } else {
    const productz = await product.updateOne(
      { _id: id },
      {
        $set: {
          name: pro.name,
          brand: pro.brand,
          price: pro.price,
          stock: pro.stock,
          category: pro.category,
          description: pro.description,
          discount: pro.discount,
          size: pro.size,
        },
      }
    );
  }
  res.redirect("/admin/productlist");
};

const coupon = async (req, res) => {
  const couponlist = await coupondb.find();
 
  res.render("admin/couponpage", { couponlist });
};

const addCoupon = (req, res) => {
  res.render("admin/addcoupon");
};

const postaddCoupon = async (req, res) => {
 
  const coupon = new coupondb(req.body);
  coupon.save().then(() => {
    res.redirect("/admin/couponpage");
  });
};

const couponDelete = async (req, res) => {
  const id = req.params.id;
  await coupondb.findByIdAndDelete({ _id: id });
  res.redirect("/admin/couponpage");
};

const Banner = async (req, res) => {
  const banners = await banner.find();
  res.render("admin/banner", { banners });
};

const AddBanner = (req, res) => {
  res.render("admin/addbanner");
};

const postBanner = (req, res) => {
 
  const image = req.files.image;
 
  let imageurl = image[0].path;
 
  imageurl = imageurl.substring(6);

  if (!image) {
    res.redirect("/admin/postbanner");
  } else {
    const banner1 = new banner({
      title: req.body.title,
      image: imageurl,
      url: req.body.url,
      description: req.body.description,
    });
    banner1.save();
    res.redirect("/admin/bannermanage");
  }
};

const bannerDelet = async (req, res) => {
  const id = req.params.id;
  await banner
    .findByIdAndDelete({ _id: id })
    .then((doc) => {
     
      res.redirect("/admin/bannermanage");
    })
    .catch((err) => console.log(err));
};

const orderList = async (req, res) => {
 
  const orderlist = await orderdb.find().populate("userId").sort({createdAt:-1})

  const Alladdress = [];
  const addresslist = await addressdb.find()

  orderlist.forEach((el, i) => {
    addresslist.forEach((x) => {
      const index = x.address.findIndex((obj) => obj._id == el.address);
      if (index >= 0) {
        Alladdress.push(x.address[index]);
      }
    });
  });

 

  res.render("admin/orderlist", { orderlist, Alladdress });
};
const changeStatus = async (req, res) => {
  const status = req.query.s;
  const orderId = req.query.id;

  await orderdb
    .findByIdAndUpdate({ _id: orderId }, { $set: { orderstatus: status } })
    .then(() => {
      res.json({ status: true });
    });
};

const productDetails = async (req, res) => {
  const orderId = req.body.orderId;
  const orderDetails = await orderdb
    .findOne({ _id: orderId })
    .populate("products.product");
  res.json(orderDetails);
};

const saleReport = async (req, res) => {
  const report = await orderdb.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$products" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
 
  res.render('admin/salereport',{report})
};
const monthReport = async (req, res) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemper",
    "October",
    "November",
    "December",
  ];
  const report = await orderdb.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$products" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const sales = report.map((el) => {
    let newRep = { ...el };
    newRep._id.month = months[newRep._id.month - 1];

    return newRep;
  });
 
  res.render('admin/monthreport',{sales})
};

const yearReport = async (req, res) => {
  const Report = await orderdb.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$products" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
 res.render('admin/yearreport',{Report})
};




  const dayChart = async(req,res)=>{
if(req.query.day){
 
    const report = await orderdb.aggregate([
      {
        $match: {
          orderstatus: { $eq: "delivered" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalprice: { $sum: "$subtotal" },
          items: { $sum: { $size: "$products" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
   
    res.json({report})
  
}else if(req.query.year){
  const Report = await orderdb.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$products" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
 res.json({Report})
}else{
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemper",
    "October",
    "November",
    "December",
  ];
  const report = await orderdb.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$products" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const sales = report.map((el) => {
    let newRep = { ...el };
    newRep._id.month = months[newRep._id.month - 1];

    return newRep;
  });
 
 


    res.json({sales})
}
}

const revnueChart= async(req,res)=>{

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemper",
    "October",
    "November",
    "December",
  ];
  const report = await orderdb.aggregate([
    {
      $match: {
        orderstatus: { $eq: "delivered" },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        totalprice: { $sum: "$subtotal" },
        items: { $sum: { $size: "$products" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const sales = report.map((el) => {
    let newRep = { ...el };
    newRep._id.month = months[newRep._id.month - 1];

    return newRep;
  });
 
  res.json({sales})

}
  

module.exports = {
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

  dayChart,
  revnueChart,
  adminLogout
};
