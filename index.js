require('dotenv').config();
const express = require('express');
const mongoose = require ("mongoose");
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
// const skuRoutes = require('./routes/skuRoutes1');
const bannerRoutes = require('./routes/bannerRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderPlacedRoutes = require('./routes/orderPlacedRoutes');
// const orderConfirmedRoutes = require('./routes/orderConfirmedRoutes');
const csvRoutes=require('./routes/csvRoutes');

// const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const bodyParser = require('body-parser');
const couponRoutes = require('./routes/couponRoutes');

const linkRoutes =require('./routes/linkRoutes')

const Port = process.env.PORT;
const db = process.env.DATABASE;
const frontend_server = process.env.FRONTEND_SERVER;
const backend_server = process.env.BACKEND_SERVER;

console.log(frontend_server, 'asdf123')
console.log(backend_server, 'asdf11')

// console.log('hi');


app.use(cors({
    origin:[frontend_server,backend_server],
}));



app.set('view engine', 'ejs');

const dbURI= process.env.DATABASE ;
mongoose.connect (dbURI, { useNewUrlParser : true, useUnifiedTopology: true})
.then((result) => app.listen (Port, ()=>{
    console.log(`Server is listening on port ${Port}`);
}))
.catch((err) => console . log(err));


// app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.use(express.static('public'));

console.log("I am runing");
console.log(Port);


app.use(express.json());
app.use(authRoutes);
app.use(couponRoutes);
app.use(productRoutes);
app.use(userRoutes);
// app.use(skuRoutes);
app.use(bannerRoutes);
app.use(linkRoutes);
app.use(checkoutRoutes);
app.use(addressRoutes);
app.use(orderPlacedRoutes);
// app.use(orderConfirmedRoutes);
app.use(csvRoutes);
app.use(cookieParser());
// app.use(checkUser);