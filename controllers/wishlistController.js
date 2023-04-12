const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const dbURI= 'mongodb+srv://sanchit:diehardfan@cluster0.lxmxcq5.mongodb.net/Footox?retryWrites=true&w=majority';


const client = new MongoClient(dbURI);
const database = client.db("Footox");
const Users = database.collection('wishlist');

let User = require('../models/wishlist');

exports.viewWishlist = async (req, res) => {
//   const wishlist = req.body.wishlist;
    // const carts = [];

    // for(var i = 0; i< cart.length; i++){
    //     carts[i] = JSON.parse("[" + cart[i] + "]");
    // }
  const user = new User({
        name:req.body,
        email: req.body.email,
        // wishlist: wishlist,
        id : req.body.id,
        quantity: req.body.quantity,
        price : req.body.price,
  });

  user.save().then((result) => {
      res.status(201).json({
        data: {
          result
        },
      });
  })
  .catch((err) => {
    console.log(err),
      res.status(500).json({
        error: err,
      });
  });
 

};

exports.getWishlist = async (req, res) => {
  User.find().then((data) => {
      // console.log(data);
    res.status(200).json(data);
  });
};
exports.delWishlist = async (req, res) => {
  Users.deleteOne({ id: req.body.id }).then((data) => {
    res.status(200).json(data);
  });
  console.log(req.body);
};