const Queue = require('bull');
var ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;

const dbURI= process.env.DATABASE;


const client = new MongoClient(dbURI);
const database = client.db("Footox");
const Order = database.collection("order details");
const Users = database.collection("stock details");


// 1. Initiating the Queue
const sendMailQueue = new Queue('sendMail', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
});



// 2. Adding a Job to the Queue

sendMailQueue.process(1, (job, done) => {
    job.progress(100).then(async() => {
      await sendMail(job.data);
      done();
    });
  });

var ctr = 0;
const sendMail=async (order)=>{

    const id=order._id;
    // console.log(id,order);
    const items=order.items;
    await items.forEach(async function(item,index,array) {
        const skuId=item.id;
        const quantity=item.quantity;
        console.log('skuid quant',skuId,quantity);
        const check= await Users.findOne({SKUId:skuId});
        await console.log(check,'check');
        if(check.Quantity<quantity){
            const filter = { _id: ObjectId(id)};
            const updateDoc = {
                $set: {status:"Order Cancelled"},
                };
            const result = await Order.updateOne(filter, updateDoc);
            console.log(result,'result');
            return;
        }
        
        ctr++; 
        if (ctr === array.length) {
            callback(id);
        }
        
            // Users.find({SKUId:skuId}).toArray(function(err, result) {
            //     console.log('result',result)
            // });
            

        
        


    });
    
    // const filter = { _id: ObjectId(id)};
    // const updateDoc = {
    //     $set: {status:"Order Confirmed"},
    //     };
    // const result = await Order.updateOne(filter, updateDoc);
    // console.log(result,'result');
    console.log('hi');

}

async function callback (id) { 
    console.log('all done'); 
    console.log('out');
    const filter = { _id: ObjectId(id)};
    const updateDoc = {
        $set: {status:"Order Confirmed"},
        };
    const result = await Order.updateOne(filter, updateDoc);
    console.log(result,'result');

}



module.exports.order_get = async (req, res) => {
  const {name,email}=req.query;
  // console.log(email);
  try {
    const address = await Address.findOne({email:email});
    res.status(201).json({address});
  }
  catch(err) {
    res.status(400).json({ err });
  }
 
}

module.exports.order_post = async (req, res) => {
    // console.log(req.body);
    console.log('order confirmed');
    sendMailQueue.add(req.body.order);

    
    
    // sendNewEmail(data)

    

        
        
    
    // try {
    

    //   const order = await Order.create({name_user:name_user,email_user:email_user,mobile_user:mobile_user,name_reciever:name_reciever,email_reciever:email_reciever,mobile_reciever:mobile_reciever,address:address.place,items:items,total:total,coupon:coupon,placed:true,status:'Order Placed'});
    //   res.status(201).json({ order: order});
    // }
    // catch(err) {
    //     // console.log(err,'hudjisk');
    //   res.status(400).json({ err });
    // }
  }

  module.exports.order_delete = async (req, res) => {
    const { email,id } = req.body;
      try {
        const user = await Cart.findOneAndUpdate({'email':email},{$pull:{cart:{id:id}}},false);
        
        res.status(201).json({ user: user});
      }
      catch(err) {
        res.status(400).json({ err });
      }
    }




