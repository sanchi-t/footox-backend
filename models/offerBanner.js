const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    offer :String,
    
},
{
    timestamps: true,
  },
  {
    versionKey: false ,
  }

)

// const User = mongoose.model('Stock Details', userSchema);

// module.exports = User;

module.exports = mongoose.models.Users || mongoose.model('Offer Banner', userSchema);