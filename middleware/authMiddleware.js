const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {OAuth2Client} = require('google-auth-library');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, '$foo9Yr$0Bt#toxOONasa-WebDt', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  console.log('checkUSer',req.body);
  const token = req.body.jwt;
  console.log(token,req?.cookies);
  if (token) {
    jwt.verify(token, '$foo9Yr$0Bt#toxOONasa-WebD', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err,'auth');
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        console.log(user,'authuser');
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


const googleAuth=(token)=>{
  const client = new OAuth2Client(907385226953-mc9c2r4j8t9nmne9dch68s65tmkq2gqg.apps.googleusercontent.com);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '907385226953-mc9c2r4j8t9nmne9dch68s65tmkq2gqg.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
verify().catch(console.error);
}


module.exports = { requireAuth, checkUser,googleAuth };