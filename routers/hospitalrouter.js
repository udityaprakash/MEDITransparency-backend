const router = require("express").Router();
const auth = require("../SRC/Auth/Authorization/authorization");
const {Hsignup, config} = require("../SRC/Auth/Authentication/hospital");
const {upload}=require("../SRC/Auth/File_Validators/imagefile");
const {logo} = require("../SRC/components/hospital/logo");

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

    router.get('/logo/:id',logo.logosend);

    router.post('/adddoctors',auth.author, Hsignup.adddoctor);

    router.post('/assignpatient', auth.author, config.assignpatient);


module.exports = router;