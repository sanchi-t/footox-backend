const mongoose = require('mongoose');




const couponSchema = new mongoose.Schema({
  User_id: {
    type: String,
  },
  Product_id: {
    type: String,
    unique:false

  },
  Date: {
    type: Date,
    
  },
  Cur_Date: {
    type: Date,
    
  },
  Coupon_Code: {
    type:String,
  }
  
});




 


const Coupon_Log = mongoose.model('coupon_logs', couponSchema);

module.exports = Coupon_Log;