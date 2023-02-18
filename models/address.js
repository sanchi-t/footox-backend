const mongoose = require('mongoose');
const { isEmail } = require('validator');




const addressSchema = new mongoose.Schema({
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
  address: {
    type: Array,
    required: [false],
    
  }
  
});







const Address = mongoose.model('address_details', addressSchema);

module.exports = Address;