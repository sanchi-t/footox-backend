const User = require("../models/users");
const jwt = require('jsonwebtoken');
const {OAuth2Client}=require('google-auth-library');
const { response } = require("express");
const Cart = require("../models/cart");
const Address = require("../models/address");


const client = new OAuth2Client("907385226953-mc9c2r4j8t9nmne9dch68s65tmkq2gqg.apps.googleusercontent.com");

const afterVerify=(name,email,username,mobile,description,res )=>{
  User.findOne({email}).exec(async (err,result)=>{
    if(err){
      console.log('Something went wrong');
    }
    else{
      if(result){

        try {
            let password=email+'907385226953-mc9c2r4j8t9nmne9dch68s65tmkq2gqg.apps.googleusercontent.com';
            const user = await User.login(email, password);
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
            res.cookie('sanchit','sharma');
            res.status(201).json({ userid: user._id,username:user.name,token:token,mobile:user.mobile,email:user.email });
          } 
          catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
          }

      }
      else{
        try {
          let password=email+'907385226953-mc9c2r4j8t9nmne9dch68s65tmkq2gqg.apps.googleusercontent.com';
          const user = await User.create({name,email, password,username,mobile,description });
          const cart = await Cart.create({name,email});
          const address = await Address.create({name,email});
          const token = createToken(user._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ userid: user._id,username:user.name,token:token,mobile:user.mobile,email:user.email});
        }
        catch(err) {
          // console.log('sign sanc',err)
          const errors = handleErrors(err);
          res.status(400).json({ errors });
        }
      }
    }
  })
}
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      console.log('properties');
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, '$foo9Yr$0Bt#toxOONasa-WebD', {
    expiresIn: maxAge
  });
};


module.exports.signup_post = async (req, res) => {
  const { name,email, password,username,mobile,description } = req.body;
  // console.log(req.body,'safghjk');

  try {
    const user = await User.create({name,email, password,username,mobile,description });
    const cart = await Cart.create({name,email});
    const address = await Address.create({name,email});
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ userid: user._id,username:user.name,token:token,mobile:user.mobile,email:user.email});
  }
  catch(err) {
    // console.log('sign sanc',err)
    const errors = handleErrors(err);
    console.log(errors,'erroes');
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.cookie('sanchit','sharma');
    const userObj=JSON.parse(JSON.stringify(user));
    // const bca=JSON.parse(abc);
    // console.log('cart',Object.keys(user),abc.cart);
    res.status(201).json({ userid: user._id,username:user.name,token:token,mobile:user.mobile,email:user.email});
  } 
  catch (err) {
    const errors = handleErrors(err);
    console.log('erros',errors);
    res.status(400).json({errors});
  }

}


module.exports.google_login = async (req, res) => {
  // const { email, password } = req.body;
  
  const tokenId=req.body.payload
  // console.log(tokenId);
  client.verifyIdToken({idToken:tokenId,audience:'907385226953-mc9c2r4j8t9nmne9dch68s65tmkq2gqg.apps.googleusercontent.com'}).then(response=>{
    const {email_verified,name,email,username,mobile,description }=response.payload;
    // console.log(email_verified,name,email,'response');
    if(email_verified){
      afterVerify(name,email,username,mobile,description,res);
    }
  })



}

module.exports.google_login_onetap = async (req, res) => {
  // const { email, password } = req.body;
  
  const {email_verified,name,email,username,mobile,description }=req.body.payload;
  // console.log(tokenId);
  
  afterVerify(name,email,username,mobile,description,res);
    
}

// module.exports.logout_get = (req, res) => {
//   res.cookie('jwt', '', { maxAge: 1 });
//   res.redirect('/');

// module.exports.login_post=async (req,res)=>{
//     const { email, password } = req.body;


//     try {
//       const user1 = await user.login(email, password);
//       const token = createToken(user1._id);
//       res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//       res.status(200).json({ user: user1._id });
      
//     } catch (err) {
//       res.status(400).json({err:err.message});
      
//     }

// }
// }