let User = require('../models/order');
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const dbURI =
  "mongodb+srv://sanchit:diehardfan@cluster0.lxmxcq5.mongodb.net/Footox?retryWrites=true&w=majority";

const client = new MongoClient(dbURI);
const database = client.db("Footox");
const users = database.collection("order details");
var ObjectId = require('mongodb').ObjectID;

exports.order = async (req, res) => {
  // console.log(req.body);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name_user:req.body.form.name_user,
        email_user: req.body.form.email_user,
        mobile_user: req.body.form.mobile_user,
        name_reciever:req.body.form.name_reciever,
        email_reciever: req.body.form.email_reciever,
        mobile_reciever: req.body.form.mobile_reciever,
        address: req.body.form.address.place,
        items: req.body.form.items,
        status:'Order Placed',
        placed: true,
        coupon:req.body.form.coupon,
        total: req.body.form.total,
    });
    user.save().then(result => {
        console.log(result),
        res.status(201).json({
            
            order: {
                result,
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
}
exports.getOrder = async (req, res) => {
    User.find().then((data) => {
        // console.log(data);
      res.status(200).json(data);
    });
  };

exports.updateOrder = async (req, res) => {
    console.log(req.body);
    const filter = { _id: ObjectId(`${req.body.orderid}`) };

    const toUpdate = {
        $set: {
            status: req.body.Status,
        },
    }
    users.updateOne(filter, toUpdate).then((data) => {
      res.status(200).json(data);
      console.log(data);
    });
  };