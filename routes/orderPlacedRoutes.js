const {Router}=require('express');
const orderPlacedController=require('../controllers/orderPlacedController');
const router = Router();

router.get('/orderPlaced',orderPlacedController.order_get);
router.post('/orderPlaced',orderPlacedController.order_post);
router.delete('/orderPlaced',orderPlacedController.order_delete);





module.exports=router;