const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const router = express.Router();
// const app = express();

// app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
let User = require("../models/offerBanner");
// const User = mongoose.model('User', {
//   name: String,
//   password: String
// });

router.post('/updateOffer', async (req, res) => {
  const {offer} = req.body;
  const user = await User.findOneAndUpdate({}, {offer});
  res.send(user);
});

router.get('/getOffer', async (req, res) => {
    const user = await User.findOne();
    res.send(user);
  });


module.exports = router;


