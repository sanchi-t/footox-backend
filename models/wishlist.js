const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    // required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
   id: {
    type: String,
    required: [false],
    
  },
  quantity:{
    type: Number,
  },
  price:{
    type: Number,
  }

  
});







const Cart = mongoose.model('wishlist', userSchema);

module.exports = Cart;