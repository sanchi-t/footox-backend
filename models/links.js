const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    link1 :String,
    link2: String,
    link3: String,
    productDescription: String,
    productDescription2: String,
    productDescription3: String,


    
},
{
    timestamps: true,
  },
  {
    versionKey: false ,
  }

)

module.exports = mongoose.models.Users || mongoose.model('Social Media links', userSchema);