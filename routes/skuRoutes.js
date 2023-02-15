let express = require('express'),
    // multer = require('multer'),
    mongoose = require('mongoose'),
    router = express.Router();

let User = require('../models/Sku');

router.post('/admin5', (req, res) => {
    // const reqFiles = [];
    // const url = req.protocol + '://' + req.get('host')
    // for (var i = 0; i < req.files.length; i++) {
    //     reqFiles.push(url + '/public/' + req.files[i].filename)
    // }
    console.log(req.body);

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        productId: req.body.productId,
        unique: req.body.SKU,
        Quantity: req.body.Quantity
        // productName: req.body.productName,
        // productGender: req.body.productGender,
        // description: req.body.description,
        // selling_price: req.body.selling_price,
        // original_price:req.body.original_price,
        // Sizes : req.body.Sizes,
        // color : req.body.color,
        // Status: req.body.Status,
        // // Sizes:req.body.Sizes
        // brand:req.body.brand,
        // // featured:req.body.featured,
        // image: reqFiles
    });

    user.save().then(result => {
        console.log(result),
        res.status(201).json({
            message: "Done upload!",
            userCreated: {
                _id: result._id,
                 SKU:result.SKU,
                 Quantity: result.Quantity
                // image: result.image
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})

router.get("/", (req, res, next) => {
    User.find().then(data => {
        res.status(200).json({
            message: "User list retrieved successfully!",
            users: data
        });
    });
});

module.exports = router;