const router = require("express").Router();
const auth = require("../SRC/Auth/Authorization/authorization");
const {Hsignup, config , hlogin} = require("../SRC/Auth/Authentication/hospital");
const {upload}=require("../SRC/Auth/File_Validators/imagefile");
const {logo} = require("../SRC/components/hospital/logo");
const {create} = require("../SRC/components/hospital/create");

router.post(
    '/uploadingdoc',
    auth.author,
    upload.fields([
        { name: 'hospitallogo', maxCount: 1 },
        { name: 'sign', maxCount: 1 }
    ]), 
    Hsignup.uploadimg);
    
    //hospital/signup
router.post('/signup', Hsignup.post); 

router.post('/login', hlogin); 

router.get('/logo/:id',logo.logosend);

router.post('/adddoctors',auth.author, Hsignup.adddoctor);

router.post('/assignpatient', auth.author, config.assignpatient);

router.post('/create/medicalrecord', auth.author,create.medicalrecord);


module.exports = router;