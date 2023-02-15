const {Router}=require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const bannerController=require('../controllers/bannerController');
const router = Router();

router.get('/banner',bannerController.banner_get);
// router.get('/men',productController.productGender_get);
// router.get('/women',productController.productGender_get);
// router.get('/shoes',productController.productCategory_get);

router.post('/banner', urlencodedParser, function (req, res) {
  

    const obj=JSON.parse(JSON.stringify(req.body));
    const jsondata= Object.keys(obj)[0];
    console.log('obj',jsondata);

    const toUpdate=JSON.parse((jsondata));
    bannerController.banner_post(toUpdate,res);
    
});


module.exports=router;