const {Router}=require('express');
const orderConfirmedController=require('../controllers/orderConfirmedController');
const router = Router();

router.get('/orderConfirmed',orderConfirmedController.order_get);
router.post('/orderConfirmed',orderConfirmedController.order_post);
router.delete('/orderConfirmed',orderConfirmedController.order_delete);





module.exports=router;