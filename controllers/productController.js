const MongoClient = require('mongodb').MongoClient;
const Fuse = require('fuse.js');

const dbURI= process.env.DATABASE;


const client = new MongoClient(dbURI);




const product=async function(toUpdate,res){
    //console.log('hello',req);
    const database = client.db("Footox");
    const users = database.collection("data");
    if(toUpdate != null && toUpdate.payload){
        const filter = { productId: toUpdate.id };
        const updateDoc = {
            $set: toUpdate.payload,
          };
        const result = await users.updateOne(filter, updateDoc);
    
    }

    else if(toUpdate != null && toUpdate.id){
        users.deleteOne( { productId: toUpdate.id } )
        console.log('deleted');
    }
    else if(toUpdate != null && toUpdate.mode){
        users.find({id: toUpdate.id})
        console.log("founded")
    }

    const product_data = await users.find({}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        res.json(result); 
    });
    
    return;

        
}



const productGender=async function(req,res){
    const page=(req.path.replace('/',''));
    const database = client.db("Footox");
    const users = database.collection("allproducts");
    const product_data = await users.find({gender:page.toUpperCase()}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result); 
    });
}




const category=async function(req,res){
    const page=(req.path.replace('/',''));
    const database = client.db("Footox");
    const users = database.collection("allproducts");
    const product_data = await users.find({category:page}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result); 
    });
}


module.exports.admin_get = (req, res) => {
    product(null,res);
}

module.exports.productGender_get = (req, res) => {
    productGender(req,res);
}

module.exports.productCategory_get = (req, res) => {
    category(req,res);
}

module.exports.admin_post = async (toUpdate, res) => {

    product(toUpdate,res)
 
}


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
   
    const category = await Product.distinct('category');
    const totalProducts = await Product.countDocuments(filter);
    // console.log(filter,resu);


    res.json({ products, totalProducts, category });
  };




