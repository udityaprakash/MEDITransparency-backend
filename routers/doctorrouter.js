const router = require("express").Router();
const auth = require("../SRC/Auth/Authorization/authorization");
const {Dsignup,Dlogin} = require("../SRC/Auth/Authentication/doctor");
const {hospitals} = require("../SRC/components/doctor/hospitaldetails");
const {patients} = require("../SRC/components/doctor/patientsdetails");
const {upload} = require("../SRC/Auth/File_Validators/imagefile");
const {Docprofile} = require("../SRC/components/doctor/profile");

//--doctor/signup
router.post('/signup',Dsignup.post);
router.get('/signup',Dsignup.get);

//--doctor/login
router.post('/login',Dlogin.post);
router.get('/login',Dlogin.get);

//--doctor/hospitals
router.get('/hospitals', auth.author, hospitals.get);

//--doctor/patients/
router.post('/patients', auth.author, patients.get);

router.post('/uploadingdoc',
    auth.author,
    upload.single('profilephoto'), 
Docprofile.setup);

router.get('/photo/:id',Docprofile.sendphoto);

router.get('/profiledetails', auth.author, Docprofile.profile);

router.post('/patient/profiledetails', auth.author, Docprofile.patientprofile);




module.exports = router;