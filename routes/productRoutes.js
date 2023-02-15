
const {Router}=require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const productController=require('../controllers/productController');
const router = Router();

router.get('/admin1',productController.admin_get);
router.get('/men',productController.productGender_get);
router.get('/women',productController.productGender_get);
router.get('/shoes',productController.productCategory_get);

router.post('/admin1', urlencodedParser, function (req, res) {  
    const obj=JSON.parse(JSON.stringify(req.body));
    const jsondata= Object.keys(obj)[0];
    const toUpdate=JSON.parse((jsondata));
    productController.admin_post(toUpdate,res);
    
});


module.exports=router;