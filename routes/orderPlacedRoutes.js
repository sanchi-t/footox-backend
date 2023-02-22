const {Router}=require('express');
const orderPlacedController=require('../controllers/orderPlacedController');
const router = Router();

router.get('/getOrder',orderPlacedController.getOrder);
router.put('/orderPlaced',orderPlacedController.updateOrder);
router.post('/orderPlaced',orderPlacedController.order);





module.exports=router;