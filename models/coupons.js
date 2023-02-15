const mongoose = require('mongoose');




const couponSchema = new mongoose.Schema({
  status: {
    type: String,
    required: [true,'Please enter status']
  },
  code: {
    type: String,
    unique:true,
    required: [true, 'Please enter a code'],

  },
  category: {
    type: String,
    required: [true, 'Please enter a category'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please enter a starting date'],
    
  },
  endDate: {
    type: Date,
    required: [false],
  },
  type: {
    type: String,
    required: [true, 'Please enter a type'],
    
  },
  value: {
    type: Number,
    required: [false],
  },
  limit: {
    type: Number,
    required: [false],
    
  },
  Id: {
    type: String,
    required: [false],
    
  }
  
});




 


const Coupon = mongoose.model('coupon_details', couponSchema);

module.exports = Coupon;