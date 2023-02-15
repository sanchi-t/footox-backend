const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId :String,
    unique: String,
    Quantity: Number
    // description: String,
    // selling_price: String,
    // original_price: String,
    // Status: String,
    // Sizes: {
    //     type: Object
    // },
    // color:{
    //     type: Array
    // },
    // brand: String,
    // featured: String,
    // image: {
    //     type: Array
    // }
    
}
// {
//     collection: 'Stock details'
// },{ versionKey: false }
)

const User = mongoose.model('Stock details', userSchema);

module.exports = User;