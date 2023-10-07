const router = require("express").Router();
const {signup,login} = require("../SRC/Auth/Authentication/user");

//--doctor/signup
router.post('/signup',signup.post);
router.get('/signup',signup.get);

module.exports = router;


