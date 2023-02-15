const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId :String,
    productName: String,
    productGender: String,
    description: String,
    selling_price: String,
    original_price: String,
    Status: String,
    createdDate: String,
    modifiedDate: String,
    Sizes: {
        type: Object
    },
    color:{
        type: Array
    },
    category: String,
    featured: String,
    image: {
        type: Array
    }
    
}, {
    collection: 'data'
},{ versionKey: false }
)

module.exports = mongoose.model('User', userSchema)