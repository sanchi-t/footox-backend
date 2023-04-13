const MongoClient = require('mongodb').MongoClient;
const Fuse = require('fuse.js');

const dbURI= process.env.DATABASE;


const client = new MongoClient(dbURI);


const database = client.db("Footox");
const Stock = database.collection("stock details");
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


module.exports.getProducts = async (req, res) => {
    const database = client.db("Footox");
    const Product = database.collection("data");



    const { page, limit } = req.query;
    const query=JSON.parse(req.query.query)
  
    // Calculate skip and limit values
    const skip = (page - 1) * limit;
    const productsPerPage = parseInt(limit);
    const filter = {};
    if (query.productName) {
        const options = {
          includeScore: true,
          keys: ['productName'],
          threshold: 0.4 // adjust the threshold value to control the fuzziness
        };
        const products=await Product.find().toArray();
        // console.log(products);
        const fuse = new Fuse(products, options);
        const fuzzyResult = fuse.search(query.productName);
        const fuzzyProductName = fuzzyResult.map(({ item }) => item.productName);
        filter.productName = { $in: fuzzyProductName };
      }
    if (query.category && query.category.length > 0) {
      filter.category = { $in: query.category };
    }
    
    if (query.colors && query.colors.length > 0) {
      filter.color = { $elemMatch: { $in: query.colors } };
    }
    if (query.sizes && query.sizes.length > 0) {
      filter.Sizes = {
        $elemMatch: {
          $elemMatch: { $in: query.sizes }
        }
      };
    }
  
  
    // Query database for products
    const products = await Product.find(filter).skip(skip).limit(productsPerPage).toArray();
    // const resu=await Product.find({ category: "Sports" }).explain("executionStats");
   
    const category1 = await Product.distinct('category');
    const filteredCategory = category1.filter((element) => {
      return typeof element === 'string' && /^[a-zA-Z\s]+$/.test(element);
    });
    const category = filteredCategory.map((element) => {
      const words = element.split(' ');
      const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedWords.join(' ');
    });
    // console.log(category);
    const totalProducts = await Product.countDocuments(filter);
    // console.log(filter,resu);


    res.json({ products, totalProducts, category });
  };

  module.exports.getOneProduct = async (req, res) => {
    const database = client.db("Footox");
    const Product = database.collection("data");



    const { productId } = req.query;
  
    
  
    const products = await Product.findOne({'productId':productId});
    // const resu=await Product.find({ category: "Sports" }).explain("executionStats");
   

    
    // console.log(category);
    // console.log(products,productId);


    res.json({ products });
  };



  module.exports.getAvailableSizes = async (req, res) => {
    const database = client.db("Footox");
    const Product = database.collection("data");



    const { skuId } = req.query;
    // console.log(skuId);
    const [productId, color, size] = skuId.split("/");

    const result = await Stock.find({
      SKUId: { $regex: `${productId}/${color}/\\d+` },
      Quantity: { $ne: 0 },
    }).toArray();


    const sizes = result.map((item) => item.SKUId.split("/")[2]);

    // console.log(sizes);
  
    
  
    // const products = await Product.findOne({'productId':productId});
    // // const resu=await Product.find({ category: "Sports" }).explain("executionStats");
   

    
    // // console.log(category);
    // // console.log(products,productId);


    res.json({ sizes });
  };

