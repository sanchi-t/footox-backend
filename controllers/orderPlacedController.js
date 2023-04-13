let User = require("../models/order");
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const Return = require("../models/order_return");
const Exchange = require("../models/exchange");

const dbURI =
  "mongodb+srv://sanchit:diehardfan@cluster0.lxmxcq5.mongodb.net/Footox?retryWrites=true&w=majority";

const client = new MongoClient(dbURI);
const database = client.db("Footox");
const users = database.collection("order details");
var ObjectId = require("mongodb").ObjectId;
// var ObjectId = new ObjectId();
var ordersss = [];
// const order = {id:101,name_reciever:'sanchit',address:'school',items:[[item_id:'shoes123',price:100],[item_id:'sneakers23',price:200]]};

// const orders = order.items.map(item => {
//   return {
//     id: order.id,
//     name_reciever: order.name_reciever,
//     address: order.address,
//     item_id: item[0],
//     price: item[1]
//   }
// });

// console.log(orders);
exports.order = async (req, res) => {
  // console.log(req.body);
  var items = req.body.form.items;
  console.log(items);
  for (let i = 0; i < items.length; i++) {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name_user: req.body.form.name_user,
      email_user: req.body.form.email_user,
      mobile_user: req.body.form.mobile_user,
      name_reciever: req.body.form.name_reciever,
      email_reciever: req.body.form.email_reciever,
      mobile_reciever: req.body.form.mobile_reciever,
      address: req.body.form.address.place,
      items: items[i],
      status: "Order Placed",
      placed: true,
      coupon: req.body.form.coupon,
      total: req.body.form.total,
    });
    const something = user.save();
    // .then(result => {
    //     console.log(result),
    //     res.status(201).json({

    //         order: {
    //             result,
    //         }
    //     })
    // })
    // .catch(err => {
    //     console.log(err),
    //         res.status(500).json({
    //             error: err
    //         });
    //   })
  }
  res.json(items);

  // const user = new User({
  //   _id: new mongoose.Types.ObjectId(),
  //   name_user: req.body.form.name_user,
  //   email_user: req.body.form.email_user,
  //   mobile_user: req.body.form.mobile_user,
  //   name_reciever: req.body.form.name_reciever,
  //   email_reciever: req.body.form.email_reciever,
  //   mobile_reciever: req.body.form.mobile_reciever,
  //   address: req.body.form.address.place,
  //   items: req.body.form.items,
  //   status: "Order Placed",
  //   placed: true,
  //   coupon: req.body.form.coupon,
  //   total: req.body.form.total,
  // });
  user
    .save()
    .then((result) => {
      console.log(result),
        res.status(201).json({
          order: {
            result,
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
// exports.getOrder = async (req, res) => {
//     User.find().then((data) => {
//         // console.log(data);
//       res.status(200).json(data);
//     });
//   };

const Memcached = require("memcached");
const memcached = new Memcached("localhost:11211");
const cacheKey = "getOrder";
exports.getOrder = async (req, res) => {
  memcached.get(cacheKey, function (err, cachedData) {
    if (err) {
      console.error("Error getting cached data", err);
    }
    if (cachedData) {
      console.log("Retrieved cached data of Order ");
      res.status(200).json(cachedData);
    } else {
      User.find()
        .then((data) => {
          // Store the data in cache for 5 minutes
          memcached.set(cacheKey, data, 180, function (err) {
            if (err) {
              console.error("Error setting cache data", err);
            } else {
              console.log("Stored data in cache in Order");
            }
          });
          res.status(200).json(data);
        })
        .catch((err) => {
          console.error("Error fetching data", err);
          res.status(500).json({ error: "Error fetching data" });
        });
    }
  });
};

exports.updateOrder = async (req, res) => {
  console.log(req.body.orderid);
  const id = new ObjectId(req.body.orderid);
  const filter = { _id: id };
  // const filter = { _id: req.body.orderid };

  const toUpdate = {
    $set: {
      status: req.body.Status,
    },
  };
  memcached.get(cacheKey, function (err, cachedData) {
    const index = cachedData.findIndex((obj) => obj._id === req.body.orderid);

    console.log(index);
    console.log(cachedData, "before");
    users
      .findOneAndUpdate(filter, toUpdate, { returnDocument: "after" })
      .then((data) => {
        res.status(200).json(data);
        if (index != -1) {
          cachedData[index] = data.value;
        }
        memcached.set(cacheKey, cachedData, 180, function (err) {
          if (err) {
            console.error("Error setting cache data", err);
          } else {
            console.log("Stored data in cache in Order");
          }
        });
      });
  });
  // console.log(ordersss, "asdcfvgbhnj");
  //updating
  // users
  //   .findOneAndUpdate(filter, toUpdate, { returnDocument: "after" })
  //   .then((data) => {
  //     res.status(200).json(data);
  //     console.log(data.value, 'updated');
  //   });
};

exports.getOrderUser = async (req, res) => {
  try {
    User.findOne({ _id: ObjectId(req.query._id) })
      .then((data) => {
        // console.log(data);
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log("e");
  }

  // const order = await User.findOne({ _id: ObjectId(req.query._id)});
  // console.log(order);
  // res.status(200).json(order);
  // const filter = { _id: ObjectId(`${req.body.orderid}`) };

  // const toUpdate = {
  //     $set: {
  //         status: req.body.Status,
  //     },
  // }
  // users.updateOne(filter, toUpdate).then((data) => {
  //   res.status(200).json(data);
  //   console.log(data);
  // });
};

exports.postOrderReturn = async (req, res) => {
  // console.log('hiii');
  console.log(req.body);
  const order_return = await Return.create({
    order_details: req.body.order,
    returnReason: req.body.selectedOption,
    comment: req.body.comment,
  });

  const updateDoc = {
    $set: {
      return: true,
      status: "Return Initialized",
      updatedAt: new Date(),
    },
  };
  try {
    User.updateOne(req.body.order, updateDoc, { upsert: true })
      .then((data) => {
        console.log(data);
        // res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log("e");
  }
};

exports.postOrderCancel = async (req, res) => {
  // console.log('hiii');
  console.log(req.body.order.order);
  // const order_return = await Return.create({orderId:req.body.order._id,returnReason:req.body.selectedOption,comment:req.body.comment});

  const updateDoc = {
    $set: {
      status: "Order Canceled",
      updatedAt: new Date(),
    },
  };
  try {
    User.updateOne(req.body.order, updateDoc, { upsert: true })
      .then((data) => {
        console.log(data);
        // res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log("e");
  }
};

exports.postOrderExchange = async (req, res) => {
  // console.log('hiii');
  console.log(req.body);
  const exchange_details = {
    exchange_size: req.body.exchange_size,
    exchange_reason: req.body.exchange_reason,
    exchange_pickup_address: req.body.exchange_pickup_address,
  };
  // const order_return = await Return.create({orderId:req.body.order._id,returnReason:req.body.selectedOption,comment:req.body.comment});

  const updateDoc = {
    $set: {
      status: "Exchange Initialized",
      exchange: true,
      exchange_details: exchange_details,
      updatedAt: new Date(),
    },
  };
  try {
    await Exchange.create({
      order_details: req.body.order,
      status: "Exchange Initialized",
      exchange: true,
      exchange_details: exchange_details,
      updatedAt: new Date(),
    })
      .then((data) => {
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    await User.updateOne(req.body.order, updateDoc, { upsert: true })
      .then((data) => {
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log("e", e);
  }
};
