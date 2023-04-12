let User = require('../models/order');
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const dbURI =
process.env.DATABASE;

const client = new MongoClient(dbURI);
const database = client.db("Footox");
const users = database.collection("order details");
var ObjectId = require('mongodb').ObjectID;

exports.order = async (req, res) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        email: req.body.email,
        OrderId:req.body.orderId,
        mobile: req.body.mobile,
        address: req.body.address,
        items: req.body.items,
        Status:req.body.status,
        TotalAmount: req.body.TotalAmount,
    });
    user.save().then(result => {
        console.log(result),
        res.status(201).json({
            message: "Done upload!",
            userCreated: {
                _id: result._id,
                name:result.name,
                email:result.email
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