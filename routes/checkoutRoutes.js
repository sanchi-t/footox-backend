const {Router}=require('express');
const checkoutController=require('../controllers/checkoutController');
const router = Router();

router.get('/checkout',checkoutController.checkout_get);
router.post('/checkout',checkoutController.checkout_post);
router.delete('/checkout',checkoutController.checkout_delete);





module.exports=router;