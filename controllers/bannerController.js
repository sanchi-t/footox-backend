const MongoClient = require('mongodb').MongoClient;

const dbURI= 'mongodb+srv://sanchit:diehardfan@cluster0.lxmxcq5.mongodb.net/Footox?retryWrites=true&w=majority';


const client = new MongoClient(dbURI);


const product=async function(toUpdate,res){
    const database = client.db("Footox");
    const users = database.collection("banner");
    if(toUpdate != null && toUpdate.payload){
        const filter = { id: toUpdate.id };
        const updateDoc = {
            $set: toUpdate.payload,
          };
        const result = await users.updateOne(filter, updateDoc);
    
    }

    else if(toUpdate != null && toUpdate.id){
        users.deleteOne( { id: toUpdate.id } )
        console.log('deleted');
    }
    const product_data = await users.find({}).toArray(function(err, result) {
        if (err) throw err;
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


module.exports.banner_get = (req, res) => {
    product(null,res);
}

// module.exports.productGender_get = (req, res) => {
//     productGender(req,res);
// }

// module.exports.productCategory_get = (req, res) => {
//     category(req,res);
// }

module.exports.banner_post = async (toUpdate, res) => {

    product(toUpdate,res)
 
}

// module.exports.adminAdd_post = async (toAdd, res) => {
//     addProduct(toAdd,res)
// }