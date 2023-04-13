const mongoose = require('mongoose');
const { isEmail } = require('validator');




const userSchema = new mongoose.Schema({
  name_reciever: {
    type: String,
    required: [true,'Please enter a name']
  },
  email_reciever: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: false,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  name_user: {
    type: String,
    required: [true,'Please enter a name']
  },
  email_user: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: false,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: [false],
    
  },
  mobile_reciever: {
    type: String,
    required: false,
    minlength: [10, 'Minimum password length is 10 digits'],
  },
  mobile_user: {
    type: String,
    required: false,
    minlength: [10, 'Minimum password length is 10 digits'],
  },
  items: {
    type: Object,
    required: [true],
    
  },
  total: {
    type: Number,
    required:[true]

  },
  coupon: {
    type: Object,
    required:[false]
  },
  placed: {
    type: Boolean,
    required:[true]
  },
  status: {
    type: String,
    required:[false]
  },
  return: {
    type: Boolean,
    required:[false]
  },
  exchange: {
    type: Boolean,
    required:[false]
  },
  exchange_details: {
    type: Object,
    // required: [true],
    
  },
  
},{
  timestamps: true,
});







const Order = mongoose.model('order details', userSchema);

module.exports = Order;