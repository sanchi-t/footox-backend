const mongoose = require('mongoose');
const { isEmail } = require('validator');




const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Please enter a name']
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  cart: {
    type: Array,
    required: [false],
    
  }
  
});







const Cart = mongoose.model('cart_details', userSchema);

module.exports = Cart;