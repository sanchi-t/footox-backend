const mongoose = require('mongoose');
const { isEmail } = require('validator');




const userSchema = new mongoose.Schema({

  order_details:{
    type:Object,
    required:[true]
  },
  exchange: {
    type: Boolean,
    required:[false]
  },
  status: {
    type: String,
    required:[false]
  },
  exchange_details: {
    type: Object,
    required: [true],
  },
  
},{
  timestamps: true,
});







const Exchange = mongoose.model('exchange', userSchema);

module.exports = Exchange;