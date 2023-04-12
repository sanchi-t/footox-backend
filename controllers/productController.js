const MongoClient = require("mongodb").MongoClient;

const dbURI =
  "mongodb+srv://sanchit:diehardfan@cluster0.lxmxcq5.mongodb.net/Footox?retryWrites=true&w=majority";

const client = new MongoClient(dbURI);
const Memcached = require("memcached");
const memcached = new Memcached("localhost:11211");
const cacheKey = "getImage";
const product = async function (toUpdate, res) {
  const database = client.db("Footox");
  const users = database.collection("data");
  if (toUpdate != null && toUpdate.payload) {
    const filter = { productId: toUpdate.id };
    const updateDoc = {
      $set: toUpdate.payload,
    };
    // const result = await users.updateOne(filter, updateDoc);

    memcached.get(cacheKey, function (err, cachedData) {
      const index = cachedData.findIndex(
        (obj) => obj.productId === toUpdate.id
      );

      console.log(index);
      console.log(cachedData, "before");
      users
        .findOneAndUpdate(filter, updateDoc, { returnDocument: "after" })
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
  } else if (toUpdate != null && toUpdate.id) {
    // users.deleteOne( { productId: toUpdate.id } )
    // console.log('deleted');

    users
      .deleteOne({ productId: toUpdate.id })
      .then((result) => {
        console.log("1234555");
        console.log("Product deleted successfully");

        // Delete the corresponding cache entry for the deleted product

        console.log("asdfghjkaman");
        console.log("Deleting product from cache");
        memcached.get(cacheKey, function (err, cachedData) {
          if (err) {
            console.error("Error getting cached data", err);
          }

          if (cachedData) {
            const filteredData = cachedData.filter(
              (item) => item.productId !== toUpdate.id
            );
            memcached.set(cacheKey, filteredData, 300, function (err) {
              if (err) {
                console.error("Error updating cache data", err);
              } else {
                console.log("Updated cache data after delete");
              }
            });
          }
        });

        res.status(200).send("Product deleted successfully");
      })
      .catch((err) => {
        console.error("Error deleting product", err);
        console.log("asdfghjknmsnc");
        res.status(500).send("Error deleting product");
      });
  } else if (toUpdate != null && toUpdate.mode) {
    users.find({ id: toUpdate.id });
    console.log("founded");
  }

  const product_data = await users.find({}).toArray(function (err, result) {
    if (err) throw err;
    console.log("asdfgh");
    res.json(result);
  });

  return;
};

const productGender = async function (req, res) {
  const page = req.path.replace("/", "");
  const database = client.db("Footox");
  const users = database.collection("allproducts");
  const product_data = await users
    .find({ gender: page.toUpperCase() })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
};

const category = async function (req, res) {
  const page = req.path.replace("/", "");
  const database = client.db("Footox");
  const users = database.collection("allproducts");
  const product_data = await users
    .find({ category: page })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
};

module.exports.admin_get = (req, res) => {
  product(null, res);
  console.log("hello");
};

module.exports.productGender_get = (req, res) => {
  productGender(req, res);
};

module.exports.productCategory_get = (req, res) => {
  category(req, res);
};

module.exports.admin_post = async (toUpdate, res) => {
  product(toUpdate, res);
};

// module.exports.adminAdd_post = async (toAdd, res) => {
//     addProduct(toAdd,res)
// }
