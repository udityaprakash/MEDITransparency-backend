const router = require("express").Router();
const {psignup,plogin} = require("../SRC/Auth/Authentication/user");

//user/signup
router.post('/signup',psignup.post);
router.get('/signup',psignup.get);

//user/login
router.post('/login',plogin.post);
router.get('/signup',psignup.get);



module.exports = router;


