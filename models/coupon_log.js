const mongoose = require('mongoose');




const couponSchema = new mongoose.Schema({
  User_email: {
    type: String,
  },
  Date: {
    type: Date,
    unique:false

  },


  Coupon_Code: {
    type:String,
  },
  Coupon_value:{
    type:String,
  }
  
});




 


const Coupon_Log = mongoose.model('coupon_logs', couponSchema);

module.exports = Coupon_Log;