const {Router}=require('express');
const authController=require('../controllers/authController');
const valid=require('../middleware/authMiddleware');

const router = Router();

router.post('/signup',authController.signup_post);
router.post('/login',authController.login_post);
router.post('/auth',valid.checkUser);
router.post('/googlelogin',authController.google_login);
router.post('/googleloginonetap',authController.google_login_onetap);
router.get('/userDetails',authController.userDetails );




module.exports=router;