const Cart = require("../models/cart");




module.exports.checkout_get = async (req, res) => {
  const {name,email}=req.query;
  // console.log(req.query,email)
  try {
    const cart = await Cart.findOne({email:email});
    // console.log('found',cart);
    res.status(201).json({cart});
  }
  catch(err) {
    // console.log('sign sanc',err)
    res.status(400).json({ err });
  }
 
}

module.exports.checkout_post = async (req, res) => {
  const { email,id,quantity } = req.body;
  // console.log(req.body,email,id,quantity);
  // const form=req.body.form;
  // // console.log('form',form.address.place)
  // if(form.address.save){
    try {
      const user = await Cart.updateOne({email:email,"cart.id":id},{$set:{"cart.$.quantity":quantity}});
      // console.log(user,'hiaddress');
      
      res.status(201).json({ user: user});
    }
    catch(err) {
      // console.log('sign sanc',err)
      res.status(400).json({ err });
    }
  }

  module.exports.checkout_delete = async (req, res) => {
    const { email,id } = req.body;
    // console.log(req.body,email,id);
    // const form=req.body.form;
    // // console.log('form',form.address.place)
    // if(form.address.save){
      try {
        const user = await Cart.findOneAndUpdate({'email':email},{$pull:{cart:{id:id}}},false);
        // console.log(user,'hiaddress');
        
        res.status(201).json({ user: user});
      }
      catch(err) {
        // console.log('sign sanc',err)
        res.status(400).json({ err });
      }
    }

  // try {
  //   const user = await User.login(email, password);
  //   const token = createToken(user._id);
  //   res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
  //   res.cookie('sanchit','sharma');
  //   res.status(200).json({ user: user._id, username:user.name,token:token });
  // } 
  // catch (err) {
  //   const errors = handleErrors(err);
  //   res.status(400).json({errors});
  // }


