const Order = require("../models/order");
// const Address = require("../models/address");




module.exports.order_get = async (req, res) => {
  const {name,email}=req.query;
  // console.log(email);
  try {
    const address = await Address.findOne({email:email});
    res.status(201).json({address});
  }
  catch(err) {
    res.status(400).json({ err });
  }
 
}

module.exports.order_post = async (req, res) => {
    // console.log(req.body.form);
    const{name_reciever,address,email_reciever,mobile_reciever,name_user,email_user,mobile_user,items,total,coupon}=req.body.form;
    // console.log(address,email,mobile,items,total,coupon);
//   const { email,id,quantity } = req.body;
    try {
    

      const order = await Order.create({name_user:name_user,email_user:email_user,mobile_user:mobile_user,name_reciever:name_reciever,email_reciever:email_reciever,mobile_reciever:mobile_reciever,address:address.place,items:items,total:total,coupon:coupon,placed:true,status:'Order Placed'});
      res.status(201).json({ order: order});
    }
    catch(err) {
        // console.log(err,'hudjisk');
      res.status(400).json({ err });
    }
  }

  module.exports.order_delete = async (req, res) => {
    const { email,id } = req.body;
      try {
        const user = await Cart.findOneAndUpdate({'email':email},{$pull:{cart:{id:id}}},false);
        
        res.status(201).json({ user: user});
      }
      catch(err) {
        res.status(400).json({ err });
      }
    }




