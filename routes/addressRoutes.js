const {Router}=require('express');
const addressController=require('../controllers/addressController');
const router = Router();

router.get('/address',addressController.address_get);
router.post('/address',addressController.address_post);
router.delete('/address',addressController.address_delete);





module.exports=router;