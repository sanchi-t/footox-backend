const Address = require("../models/address");




module.exports.address_get = async (req, res) => {
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

module.exports.address_post = async (req, res) => {
  // console.log(req.body);
  const {email}=req.body;
  const {place,save}=req.body.address;
  // console.log(place);
  // const { email,id,quantity } = req.body;
    try {

      if(save){
        const address = await Address.updateOne({email:email},{ $push: {address:place} },{upsert:true});
        console.log(address);
        res.status(201).json({ address: address});

      }
      
    }
    catch(err) {
      // console.log(err);
      res.status(400).json({ err });
    }
  }

  module.exports.address_delete = async (req, res) => {
    const { email,id } = req.body;
      try {
        const user = await Cart.findOneAndUpdate({'email':email},{$pull:{cart:{id:id}}},false);
        
        res.status(201).json({ user: user});
      }
      catch(err) {
        res.status(400).json({ err });
      }
    }




