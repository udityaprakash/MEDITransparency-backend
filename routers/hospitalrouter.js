const router = require("express").Router();
const auth = require("../SRC/Auth/Authorization/authorization");
const {Hsignup} = require("../SRC/Auth/Authentication/hospital");
const {upload}=require("../SRC/Auth/File_Validators/imagefile");


//hospital/signup
router.post(
    '/uploadingdoc',
    auth.author,
    upload.fields([
        { name: 'hospitallogo', maxCount: 1 },
        { name: 'sign', maxCount: 1 }
    ]), 
    Hsignup.uploadimg);

    router.post('/signup', Hsignup.post);  

    router.post('/adddoctors',auth.author,Hsignup.adddoctor);



module.exports = router;