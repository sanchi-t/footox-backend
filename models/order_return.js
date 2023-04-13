const mongoose = require('mongoose');




const cartSchema = new mongoose.Schema({
  order_details: {
    type: Object,
    required: [true,'Please enter order id']
  },
  
  returnReason: {
    type: String,
    required: [true],
    
  },
  comment: {
    type: String,
    required: [false],
    
  }
  
});







const Return = mongoose.model('order_return', cartSchema);

module.exports = Return;