const router = require("express").Router();
const {Hsignup} = require("../SRC/Auth/Authentication/hospital");
const {upload}=require("../SRC/Auth/File_Validators/imagefile");


//hospital/signup
router.post(
    '/signup',
    upload.fields([
        { name: 'hospitallogo', maxCount: 1 },
        { name: 'sign', maxCount: 1 }
    ]), 
    Hsignup.post);



module.exports = router;