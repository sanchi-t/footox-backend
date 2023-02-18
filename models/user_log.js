const mongoose = require('mongoose');




const couponSchema = new mongoose.Schema({
  User_email: {
    type: String,
  },
  UUID: {
    type: String,
    unique:false

  },


  Coupon_Code: {
    type:String,
  }
  
});




 


const User_Log = mongoose.model('user_logs', couponSchema);

module.exports = User_Log;