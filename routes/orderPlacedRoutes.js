const {Router}=require('express');
const orderPlacedController=require('../controllers/orderPlacedController');
const router = Router();

router.get('/getOrder',orderPlacedController.getOrder);
router.put('/orderPlaced',orderPlacedController.updateOrder);
router.post('/orderPlaced',orderPlacedController.order);
router.get("/getOrderUser",orderPlacedController.getOrderUser);
router.post("/postOrderReturn",orderPlacedController.postOrderReturn);
router.post("/postOrderCancel",orderPlacedController.postOrderCancel);
router.post("/postOrderExchange",orderPlacedController.postOrderExchange);






module.exports=router;