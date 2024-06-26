const router = require("express").Router();
const {psignup, plogin, setupprofile} = require("../SRC/Auth/Authentication/user");
const auth = require('../SRC/Auth/Authorization/authorization');
const {upload} = require("../SRC/Auth/File_Validators/imagefile");
const {patientinfo} = require("../SRC/components/user/senduserphoto");
const {create} = require("../SRC/components/hospital/create");
//user/signup
router.post('/signup',psignup.post);
router.get('/signup',psignup.get);

//user/login
router.post('/login',plogin.post);
router.get('/signup',psignup.get);

//user/setupprofile
router.post('/setupprofile', auth.author, setupprofile.userinfo);

router.post('/uploadingdoc',
    auth.author,
    upload.single('profilephoto'), 
setupprofile.image);

router.get('/photo/:id',patientinfo.picsend);

router.get('/medicalrecord/:id',create.viewrecordimage);




module.exports = router;


