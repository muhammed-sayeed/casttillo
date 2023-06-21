const { name } = require("ejs");
const mongoose = require("mongoose");
const Userdb = require("../model/usermodel");
const { sendotp, varifyotp } = require("../verification/otp");
const bcrypt = require("bcrypt");
const user = require("../model/usermodel");
const product = require("../model/product");
const category = require("../model/category");
const cart = require("../model/cart");
const address = require("../model/address");
const order = require("../model/order");
const crypto = require("crypto");
const whishlist = require("../model/whishlist");
const paypal = require("@paypal/checkout-server-sdk")

const { log } = require("console");
const { find } = require("../model/usermodel");
const { coupon } = require("./admincontroller");
const coupondb = require("../model/coupon");
const { mailer } = require("../config/mail");
const { validationResult } = require("express-validator");
const AppError = require("../apperror");

const envirolment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalCliend = new paypal.core.PayPalHttpClient(
  new envirolment(process.env.PAYPAL_CLIND_ID, process.env.SECRET_KEY)
);
// const paypalCliend = process.env.PAYPAL_CLIND_ID
// const SECRET_KEY = process.env.SECRET_KEY


const homeView = async (req, res,next) => {
 try{
  items_per_page = 8;
  const productz = await product.find().limit(items_per_page);
  let wish = null;
  let user = null;
  const count = req.count;
  const uSer = req.User;
  if (req.session.login) {
    const id = req.session.login._id;
    user = req.session.login;
    wish = await whishlist.findOne({ user: id });

   
  }

  res.render("user/home", { productz, wish, user, count, uSer });
 } catch(e){
next (new Error(e))
 }
};

const viewMore = async (req, res,next) => {
  try{
    const id = req.params.id;
    const count = req.count;
    const uSer = req.User;
    const details = await product.findById(id).populate("category");
    if(!details){
      return next( new AppError('No Details found in this id',404))
    }
  
    res.render("user/productdetails", { details, count,uSer });
  }catch(e){
    next (new Error(e))
     }

};

const loginView = (req, res) => {
  res.render("user/login");
};

const postloginView = async (req, res,next) => {
  try{
    const { email, password } = req.body;
    const loginDetails = await Userdb.findOne({ email: email });
  
    if (loginDetails && loginDetails.access) {
      data = await bcrypt.compare(password, loginDetails.password);
  
      if (data) {
        req.session.login = loginDetails;
  
        res.redirect("/");
  
  
        var emails = {
          to: [loginDetails.email],
          from: "sayeedmon25@gmail.com",
          subject: "sigin notification",
          text: "We Welcomes you to Callisto",
          html: "<b>We Welcomes you to Callisto</b>",
        };
        mailer.sendMail(emails, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log(res.response + "email sended");
          }
        });
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  }catch(e){
    next(new Error(e))
  }
 
};

const forgettPassword = (req, res) => {
  res.render("user/forgett");
};

const postForgett = (req, res) => {
 
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/password");
    }
    const token = buffer.toString("hex");
    user
      .findOne({ email: req.body.email })
      .then((users) => {
        if (!users) {
          return res.redirect("/password");
        }
        users.resetToken = token;
        users.resetTokenExpiration = Date.now() + 3600000;
        return users.save();
      })

      .then((result) => {
        res.redirect("/");
        var emails = {
          to: [result.email],
          from: "sayeedmon25@gmail.com",
          subject: "password reseted",

          html: `
          <p>You Requested  a Password reset </p>
           <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a passwor</p>
        `,
        };
        mailer.sendMail(emails, function (err, res) {
          if (err) {
          } else {
            console.log(res.response + "email sended");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const Token = (req, res) => {
  const token = req.params.token;
  user
    .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((users) => {
      res.render("user/reset", { userid: users._id });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postreset = (req, res,next) => {
  try{
    let updatedUser;
    const newpassword = req.body.password;
    const userId = req.body.userid;
    user
      .findOne({ _id: userId })
      .then((users) => {
        updatedUser = users;
        return bcrypt.hash(newpassword, 12);
      })
      .then((hashedpassword) => {
        updatedUser.password = hashedpassword;
        updatedUser.conform = hashedpassword;
        updatedUser.resetToken = undefined;
        updatedUser.resetTokenExpiration = undefined;
        return updatedUser.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
  }catch(e){
    next (new Error(e))
  }
 
};

const signView = (req, res,next) => {
  try{const errorms = req.flash('signerr')
 
  res.render("user/signup",{errormsg:errorms[0]});
}catch(e){
  next (new Error(e))
}
}

const postsignupView = async (req, res,next) => {
 try{const error = validationResult(req)
 
  if(!error.isEmpty()){
    res.render("user/signup",{errormsg:error.array()[0].msg
  
     } );
  }
  const number = req.body.phone;
  const user = await Userdb.findOne({ email: req.body.email });

  if (user) {
    req.flash('signerr','Email already Exist')
    res.redirect("/signup");
    return
  } else {
   
    req.session.user1 = req.body;
    sendotp(number);

    res.render("user/otp");
  }
}catch(e){
  next (new Error(e))
}
};

const postOtp = async (req, res,next) => {
 try{ const otp = req.body.otp;
  const { name, phone, email, password, conform } = req.session.user1;

  varifyotp(phone, otp).then(async (verification_check) => {
    if (verification_check.status == "approved") {
      const hashpassword = await bcrypt.hash(password, 10);
      const hashedconfirmpassword = await bcrypt.hash(conform, 10);

      const user = new Userdb({
        name: name,
        phone: phone, 
        email: email,
        password: hashpassword,
        conform: hashedconfirmpassword,
      });

      await user.save().then((doc) => {
        req.session.login = doc;
        res.redirect("/");
      });
    }
  })
}catch(e){
  next (new Error(e))
}
};

const shopView = async (req, res,next) => {

 try{ let productlist;
  let page = null;
  let items_per_page = null;
  let total_products = null;
  const count = req.count;
  const uSer = req.User;
  const typeData = {
    typelisting: "listing",
    key: null,
  };
  if (req.query.cat) {
    try {
      productlist = await product
        .find({ category: req.query.cat })
        .populate("category");
    } catch (err) {}
    typeData.typelisting = "catlisting";
  } else if (req.query.q) {
    typeData.typelisting = "qListing";
    typeData.key = req.query.q;
    try {
      const skey = req.query.q;

      productlist = await product.find({ _id: skey });
    } catch (e) {}
  } else if (parseInt(req.query.page) !== 1) {
   
    pagination = true;
    page = parseInt(req.query.page) || 1;
    items_per_page = 6;
   
    total_products = await product.find().countDocuments();
    productlist = await product
      .find()
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    res.json({
      productlist,
      uSer,
      pagination,
      page,
      hasNextPage: items_per_page * page < total_products,
      pagination,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
    return;
  } else {
   
    pagination = true;
    page = parseInt(req.query.page) || 1;
    items_per_page = 6;
   

    total_products = await product.find().countDocuments();
    productlist = await product
      .find()
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
  }
  const categories = await category.find();
  res.render("user/shoppage", {
    productlist,
    uSer,
    categories,
    count,
    page,
    hasNextPage: items_per_page * page < total_products,
    pagination,
    hasPreviousPage: page > 1,
    PreviousPage: page - 1,
  })
}catch(e){
  next (new Error(e))
}
};

const getCart = async (req, res,next) => {
  try{const userId = req.session.login._id;
  const count = req.count;
  const uSer = req.User;

  const cartitems = await cart
    .findOne({ owner: mongoose.Types.ObjectId(userId) })
    .populate("items.product");

  const coupons = await coupondb.find();

  res.render("user/cart", { cartitems, userId, coupons, count, uSer })
}catch(e){
  next (new Error(e))
}
};

const addTocart = async (req, res,next) => {
  try{const proid = req.query.productid;
  const userId = req.session.login._id;

  const Product = await product.findOne({ _id: proid });
  if(!Product ){
    return next( new AppError('No coupon found in this id',404))
  }
  const user = await cart.findOne({ owner: userId });
  if (Product.stock < 1) {
  } else {
   
    if (!user) {
      const newCart = await cart({
        owner: userId,
        items: [{ product: proid, totalprice: Product.price }],
        cartTotal: Product.price,
      });
      await newCart.save();
    } else {
      const productlist = await cart.findOne({
        owner: userId,
        "items.product": proid,
      });

      if (productlist !== null) {
        await cart.findOneAndUpdate(
          {
            owner: userId,
            "items.product": proid,
          },
          {
            $inc: {
              "items.$.quantity": 1,
              "items.$.totalprice": Product.price,
              cartTotal: Product.price,
            },
          }
        );
      } else {
        const nweproAdd = await cart.findOneAndUpdate(
          { owner: userId },
          {
            $push: {
              items: { product: proid, totalprice: Product.price },
            },
            $inc: {
              cartTotal: Product.price,
            },
          }
        );
      }
    }
  }
  res.json({status:true})
}catch(e){
  next (new Error(e))
}
};

const removefromcart = async (req, res,next) => {
 
  try{let userdata = req.session.login;
 
  const proid = req.query.productid;
  let products = await product.findOne({ _id: proid });
  let carts = await cart.findOne({ owner: userdata._id });

  
  let index = await carts.items.findIndex((el) => {
    return el.product == proid;
  });

  let price = carts.items[index].totalprice;
 
  let deletingproduct = await cart.findOneAndUpdate(
    { owner: userdata._id },
    {
      $pull: {
        items: { product: proid },
      },
      $inc: { cartTotal: -price },
    }
  );
 
  res.json("succeed")
}catch(e){
  next (new Error(e))
}
};

const quantityChange = async (req, res,next) => {
 
  try{let carts = await cart.findOne({ _id: req.query.cartid });
 
  const products = await product.findOne({ _id: req.query.productid });
  productprice = products.price;
  const cartcount = req.query.cartcount;
 
 
  if (cartcount == 1) {
    const index =  carts.items.findIndex(
      (obj) => obj.product == req.query.productid
    );
    if (carts.items[index].quantity >= products.stock) {
      
      res.json({ stock: true });
      return;
    } else {
      
      var product_price = products.price;
    }
  } else {
    var product_price = -products.price;
   
  }
 
  let updatedcart = await cart.findOneAndUpdate(
    {
      _id: req.query.cartid,
      "items.product": req.query.productid,
    },
    {
      $inc: {
        "items.$.quantity": cartcount,
        "items.$.totalprice": product_price,
        cartTotal: product_price,
      },
    }
  );
  
  let index =  updatedcart.items.findIndex(
    (objitems) => objitems.product == req.query.productid
  );
  let newcart = await cart.findOne({ _id: req.query.cartid });
  let qty = newcart.items[index].quantity;
  let total = newcart.cartTotal;
  let totalprice = newcart.items[index].totalprice;


  res.json({ total, qty, totalprice })
}catch(e){
  next (new Error(e))
}
};

const cartEmpty = (req, res) => {
  res.render("user/cartempty");
};

const profilePage = async (req, res) => {
  const count = req.count;
  const uSer = req.User;
  
  const userdetails = req.session.login;
 
  const userId = req.session.login._id;

  const useraddres = await address.findOne({ user: userId });
 
  if (useraddres) {
    const findaddress = useraddres.address;
    res.render("user/profile", {
      userdetails,
      findaddress,
      useraddres,
      count,
      uSer,
      
    });
  } else {
    res.render("user/profile", { userdetails, useraddres, count, uSer });
  }
 
};

const addAddres = async (req, res) => {
 
  const userId = req.session.login._id;

  const addreexist = await address.findOne({ user: userId });
 
  if (addreexist) {
    await address.findOneAndUpdate(
      { user: userId },
      { $push: { address: [req.body] } }
    );

    res.redirect("/profile");
  } else {
    
    const useraddres = await address({
      user: userId,
      address: [req.body],
    });
   
    useraddres.save().then(() => {
      res.redirect("/profile");
    });
  }
};

const addCheckAddres = async (req, res) => {

  const userId = req.session.login._id;

  const addreexist = await address.findOne({ user: userId });
 
  if (addreexist) {
    await address.findOneAndUpdate(
      { user: userId },
      { $push: { address: [req.body] } }
    );
   
    res.redirect("/checkout");
  } else {
   
    const useraddres = await address({
      user: userId,
      address: [req.body],
    });
   
    useraddres.save().then(() => {
      res.redirect("/checkout");
    });
  }
};

const addressDelete = async (req, res) => {
 
  const id = req.params.id;
 
  userid = req.session.login._id;
 
  await address.updateOne(
    { user: userid },
    { $pull: { address: { _id: id } } }
  );
  res.json("deleting");
};

const addressEdit = async (req, res) => {
 
  const addId = req.params.id;
  const { name, phone, addres, city, state, pin } = req.body;
 
  await address.updateMany(
    { "address._id": addId },
    {
      $set: {
        "address.$.name": name,
        "address.$.phone": phone,
        "address.$.address": addres,
        "address.$city": city,
        "address.$.state": state,
        "address.$pin": pin,
      },
    }
  );
  res.redirect("/profile");
};

const checkoutPage = async (req, res) => {
 
  let userid = req.query.user;
  const code = req.query.code;
  const total = req.query.total;
  const count = req.count;
  const uSer = req.User;


 
  userid = mongoose.Types.ObjectId(userid);
  if(!userid){
    return next( new AppError('No user found in this id',404))
  }
  const user = { userId: "" };
  user.userId = userid;

  

  const addresses = await address.find({ user: userid });
 
  
  const usercart = await cart
    .findOne({ owner: userid })
    .populate("items.product");

 
  const error = req.flash("error");
  res.render("user/checkout", {
    addresses,
    usercart,
    error,
    total,
    count,
    uSer,
    paypalClindId: process.env.PAYPAL_CLIND_ID,
  });
};

const postCheck = async (req, res) => {
 
  const addressid = req.body.index
  const ordertype = req.body.paymode
  const Amount = req.body.total
  

  
   const count = req.count;
  const uSer = req.User;

  const userId = req.session.login._id
  const ordercart = await cart.findOne({owner:userId})

   const Address = await address.findOne({user:userId})

   console.log("ASDFGHGFDDDDDDDDDDDDDD",Address)
  
  const DeliveryAddress = Address.address.find(
    (el) => el._id.toString() == addressid
  );
 console.log(DeliveryAddress._id,"<><><><><<<<><>");
  if (ordertype === "cod") {
 
    const neworder = new order({
      date: new Date(),
      userId: ordercart.owner,
      products: ordercart.items,
      subtotal: Amount,
      address: DeliveryAddress._id,
      paymentmethod: ordertype,
      orderstatus: "Conformed",
    });
    neworder.save().then((result)=>{
     
      ordercart.items = [];
    ordercart.cartTotal = 0;
    ordercart.save();

      res.json({ cod: true })
    })

   
  } else if (ordertype === 'paypal') {
   
  
    const neworder = new order({
      date: new Date(),
      userId: ordercart.owner,
      products: ordercart.items,
      subtotal: Amount,
      address: DeliveryAddress._id,
      paymentmethod: ordertype,
      orderstatus: "Conformed",
    });
    await neworder.save().then((result) => {
     
      let userOrderdata = result;

      let response = {
        Razorpay: true,
        walletBalance: Amount,
        userOrderData: userOrderdata,
      };
      res.json(response);
    });
  }
};

const creatorder= async(req,res)=>{
 console.log('paypal=============================');
 console.log(paypalCliend);
  const request = new paypal.orders.OrdersCreateRequest();

 
  const balance = req.body.items[0].amount;
  console.log(balance);

 
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
     purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: balance, 

          breakdown: {
            item_total: {
              currency_code: "USD",
              value: balance,
            },
          },
        },
      },
    ],
  });
  try {
   
    console.log('pay --------------------------------------');
    
    const order = await paypalCliend.execute(request);

   console.log(order,'sdfgtrrrrrrrrrrrrrrrrrrrrr');
    res.json({ id: order.result.id });
  } catch (e) {
   console.log(e);
    res.status(500).json(e);
  }
};

const varifypeyment= async (req,res)=>{

userId = req.session.login._id 
const ordercart = await cart.findOne({owner:userId})
ordercart.items = [];
ordercart.cartTotal = 0;
 ordercart.save();

    res.json({status:true})

}




const successPage = async (req, res) => {
  const count = req.count;
  const uSer = req.User;

  res.render("user/success", { count, uSer });
};

const orderList = async (req, res) => {
 
  const orderlist = await order
    .find()
    .populate("userId")
    .sort({ createdAt: -1 });
  const count = req.count;
  const uSer = req.User;
  const Alladdress = [];
  const addresslist = await address.find();

  orderlist.forEach((el, i) => {
    addresslist.forEach((x) => {
      const index = x.address.findIndex((obj) => obj._id == el.address);
      if (index >= 0) {
        Alladdress.push(x.address[index]);
      }
    });
  });

  let a = { add: "" };

  a.add = Alladdress;
 
  res.render("user/orderlist", { orderlist, a, count, uSer });
};

const detailPage = async (req, res) => {
  const id = req.query.id;
  console.log(id);
  const uSer = req.User;

  const orders = await order.find();

  const orderView = await order
    .findOne({ _id: id })
    .populate("products.product");

    console.log(orderView,'asssssssssssssssssssssssssssssssssssssssss');
  console.log(orders);
  const addessId = orderView.address;
  const count = req.count;

  console.log(addessId,"<><><>>>>>>>>>>>>>>>>>>>>>>><<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<")


  
  const orderAddress = await address.findOne({ user: orderView.userId });
  const index = await orderAddress.address.findIndex(
    (obj) => obj._id == addessId
  );
  const finalAddress = orderAddress.address[index];

// const {name,phone,state,city,pin}=addessId;
// console.log("jhhhhhhhhhhhhhhhhhhhhhhhhh",name)
 console.log(finalAddress,"{{{{{{{{{{{}{}{}}{}{}}}}}}}}}}}}}")


 

  res.render("user/orderdetails", { orderView, finalAddress, count, uSer });
};

const couponCheck = async (req, res) => {
 
  let userid = req.body.user;
  const total = parseInt(req.body.carttotal);
  
  const validcoupon = await coupondb.findOne({ code: req.body.couponcode });

  if (validcoupon.mincartAmout > total) {
    res.json({ data: true });
  } else if (validcoupon && validcoupon.mincartAmout <= total) {
    
    const redeem = validcoupon.maxdiscountAmount;
    const redeemedTotal = total - redeem;
    res.json({ status: true, redeemedTotal, redeem ,total });

    
  } else {
    res.json({ status: false, message: "Invalid Coupon" });
  }
};

const search = async (req, res) => {
  const sResult = [];
  const skey = req.body.payload;
  
  const regex = new RegExp("^" + skey + ".*", "i");
  const pros = await product.aggregate([
    {
      $match: {
        $or: [{ name: regex }, { description: regex }, { brand: regex }],
      },
    },
  ]);

  pros.forEach((val, i) => {
    sResult.push({ title: val.name, type: "product", id: val._id });
  });

  const catlist = await category.aggregate([
    { $match: { $or: [{ name: regex }, { description: regex }] } },
  ]);
  catlist.forEach((val, i) => {
    sResult.push({ title: val.name, type: "category", id: val._id });
  });
 
  res.send({ payload: sResult });
};

const logout = (req, res) => {
  req.session.login = null;
  res.render("user/login");
};

const addTowish = async (req, res) => {
  const pro = req.query.pro;
  const userId = req.session.login._id;
 
  const user = await whishlist.findOne({ user: userId });
  if (user) {
    const index = await user.products.findIndex((obj) => obj.product == pro);
    if (index >= 0) {
      user.products.splice(index, 1);
      await user.save();
      res.json({ remove: true });
    } else {
      const pros = { product: pro };
      user.products.push(pros);
      await user.save();
      res.json({ added: true });
    }
  } else {
    const wl = new whishlist({
      userId: userId,
      products: [
        {
          product: pro,
        },
      ],
    });
    wl.save()
      .then((doc) => {
        console.log(doc);
        res.json({ added: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const wishlist = async (req, res) => {
  const count = req.count;
  const uSer = req.User;
  const userid = req.session.login._id;
  const wishitems = await whishlist
    .findOne({ userId: userid })
    .populate("products.product");
 
  res.render("user/wishlist", { wishitems, count, uSer });
};

const orderPrint = async (req, res) => {
  const id = req.query.id;

  const orderView = await order
    .findOne({ _id: id })
    .populate("products.product");
 
  const addessId = orderView.address;
  const count = req.count;

  const orderAddress = await address.findOne({ user: orderView.userId });
  const index = await orderAddress.address.findIndex(
    (obj) => obj._id == addessId
  );
  const finalAddress = orderAddress.address[index];

  

  res.render("user/orderprint", { orderView, finalAddress, count });
};

const errorPage = (req, res) => {
  res.render("user/404");
};

const removefromwish = async (req, res,next) => {
 
  try{
    let userdata = req.session.login;
 
  const proid = req.query.productid;
  console.log(proid,'sssssssssssdddddddddsssd');

  let products = await product.findOne({ _id: proid });
  let wishlist = await whishlist.findOne({ owner: userdata._id });

  
  
  
 
  let deletingproduct = await whishlist.findOneAndUpdate(
    { owner: userdata._id },
    {
      $pull: {
        products: { product: proid },
      },
     
    }
  );
 
  res.json("succeed")
}catch(e){
  next (new Error(e))
}
};
module.exports = {
  homeView,
  loginView,
  signView,

  postsignupView,
  postOtp,
  postloginView,
  logout,
  viewMore,
  getCart,

  addTocart,
  removefromcart,
  quantityChange,
  shopView,
  profilePage,
  addAddres,
  addressDelete,
  addressEdit,
  checkoutPage,

  postCheck,

  orderList,
  cartEmpty,
  forgettPassword,
  postForgett,
  Token,
  postreset,
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
};
