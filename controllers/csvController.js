const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const User = require("../Models/Sku1");
const express = require("express");
const router = express.Router();
// const data1 = require("../Models/models")
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const { json } = require("body-parser");
const dbURI= 'mongodb+srv://sanchit:diehardfan@cluster0.lxmxcq5.mongodb.net/Footox?retryWrites=true&w=majority';


const client = new MongoClient(dbURI);
const database = client.db("Footox");
const users = database.collection("data");
const Stock = database.collection("stock details");

var count = 0;
var inserted = 0;
var allcount = [4, 3];
const setInserted = (val) => {
  inserted = val;
  allcount.push(inserted);
  printInserted();
  // count1();
};
// function printCount(){
//     console.log(count,'count')
//     // allcount.push(count)
// }
// console.log(count)
function printInserted() {
  console.log(allcount, "inerted");
  // const allcount1 = allcount;
  // return allcount1;
  // allcount.push(inserted)
}

exports.count1 = async (req, res) => {
  // res.render({user: "aman"})
  res.status(200).json(allcount);
};

exports.create = async (req, res) => {
  console.log(req.file);
  const totalRecords = [];
  const productIds = []; // const count = '';

  // var obj = {};
  // const setCount=(val)=>{
  //     count=val;
  //     printCount();
  // }
  // const setInserted=(val)=>{
  //     inserted=val;
  //     printCount();
  // }
  // function printCount(){
  //     console.log(inserted,'cvghbj')
  // }

  if (req.file) {
    try {
      console.log(
        path.join(__dirname, "../", "/CSVFile/csv/" + req.file.filename)
      );
      fs.createReadStream(
        path.join(__dirname, "../", "/CSVFile/csv/" + req.file.filename)
      )
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => console.error(error))
        .on("data", (row) => totalRecords.push(row))
        .on("data", (row) => console.log(row.productId))
        .on("end", async (rowCount) => {
          try {
            users
              .find({})
              .project({ productId: 1, _id: 0 })
              .toArray(function (err, result) {
                if (err) throw err;
                console.log("prp");
                var aman = [];
                var insertedProducts = [];

                for (let i = 0; i < result.length; i++) {
                  console.log(result[i].productId);
                  aman.push(result[i].productId);
                }
                productIds.push.apply(productIds, aman);
                console.log("trybefore", totalRecords);
                for (let i = 0; i < totalRecords.length; i++) {
                  const pi = totalRecords[i].productId;
                  if (productIds.includes(pi)) {
                    var aman1 = totalRecords.find(
                      (item) => item.productId === pi
                    );
                    insertedProducts.push(aman1);
                  }
                }

                res.json(productIds);
                console.log("try", insertedProducts);
                const inserted1 = insertedProducts.length;
                setInserted(inserted1);
                console.log(inserted);

                // const users = User.insertMany(aman1);
                for (let i = 0; i < insertedProducts.length; i++) {
                  const pid = insertedProducts[i].productId;
                  console.log(insertedProducts[i]);
                  const skuid = insertedProducts[i].SKUId;

                  const quant = insertedProducts[i].Quantity;

                  const user1 = {
                    $set: {
                      // _id: new mongoose.Types.ObjectId(),
                      productId: pid,
                      SKUId: skuid,
                      Quantity: quant,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  };
                  const users = Stock.updateOne({ SKUId: skuid }, user1, {
                    upsert: true,
                  });
                  // // console.log('try3', totalRecords.productId);
                }
              });
            count = rowCount;
            setInserted(rowCount);
          } catch (err) {
            res.status(400).json(err);
          }
        });
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    // const Stock = database.collection("stock details");
    const user = {
      $set: {
        // _id: new mongoose.Types.ObjectId(),
        productId: req.body.productId,
        SKUId: req.body.SKUId,
        Quantity: req.body.Quantity,
      },
    };
    User.updateOne({ SKUId: req.body.SKUId }, user, { upsert: true })
      .then((result) => {
        console.log(result),
          res.status(201).json({
            message: "Done upload!",
            userCreated: {
              _id: result._id,
              productName: result.productName,
              image: result.image,
            },
          });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  }
};

exports.stock = async (req, res) => {
  User.find().then((data) => {
    res.status(200).json(data);
  });
};

// const Memcached = require('memcached');
// const memcached = new Memcached('localhost:11211');

// exports.stock = async (req, res) => {
//   const cacheKey = 'stock';
//   memcached.get(cacheKey, function(err, cachedData) {
//     if (err) {
//       console.error('Error getting cached data', err);
//     }
//     if (cachedData) {
//       console.log('Retrieved cached data of Stock');
//       res.status(200).json(cachedData);
//     } else {
//       User.find().then((data) => {
//         // Store the data in cache for 5 minutes
//         memcached.set(cacheKey, data, 300, function(err) {
//           if (err) {
//             console.error('Error setting cache data', err);
//           } else {
//             console.log('Stored data in cache of Stock');
//           }
//         });
//         res.status(200).json(data);
//       }).catch((err) => {
//         console.error('Error fetching data', err);
//         res.status(500).json({ error: 'Error fetching data' });
//       });
//     }
//   });
// };

// exports.skuid = async(req, res)=>{
//   const items = req.body.items;
//   console.log(items);
//   for(let i = 0; i< items.length; i++){

//     const skuid = items[i].id;
//   // const user = {
//   //   $set: {
//   //     Quantity: Quantity- items[i].Quantity,
//   //   },
//   // };
//   User.find({SKUId:skuid}).then((data)=>{
//     res.status(200).json(data);
//   })
// }
// }
exports.del = async (req, res) => {
  User.deleteMany({ productId: req.body.productId }).then((data) => {
    res.status(200).json(data);
  });
  console.log(req.body);
};

exports.checkout = async (req, res) => {
  const items = req.body.items;

  console.log(items, "aman");
  let count = 10;
  let count1 = 10;
  for (let i = 0; i < items.length; i++) {
    const skuid = items[i].id;

    await Stock.findOne({ SKUId: skuid }).then((data) => {
      console.log(data);
      if(data != null){
      if (data.Quantity - items[i].quantity >=0) {
        const user = {
          $inc: {
            Quantity: -items[i].quantity,
          },
        };
        Stock.updateOne({ SKUId: skuid }, user);
      } else {
        console.log("quantity can't be zero");
        
        // res.send("order is out of stock");
        // count.push(0);
        // res.send("Order is out of stock");
        myFunction()

        // send1(0);
      }}else{
        myFunction1()

      }
    });
  }
  function myFunction(){
        return count--;
    }

    function myFunction1(){
      return count1--;
  }
    let nmk = myFunction();
    let outOfstock = myFunction1();
    console.log(nmk);


 if(outOfstock!= 10){
  res.send("Not Available");
 }else{
  if(nmk!=10){
    res.send('Not Available');
   }else{
    res.send('Available')
   }
 }
};

// exports.stock = await users.find({}).toArray(function(err, result) {
//     if (err) throw err;

//     res.json(result);
// });