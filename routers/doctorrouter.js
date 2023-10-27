const router = require("express").Router();
const auth = require("../SRC/Auth/Authorization/authorization");
const {Dsignup,Dlogin} = require("../SRC/Auth/Authentication/doctor");
const {hospitals} = require("../SRC/components/doctor/hospitaldetails");
const {patients} = require("../SRC/components/doctor/patientsdetails");

//--doctor/signup
router.post('/signup',Dsignup.post);
router.get('/signup',Dsignup.get);

//--doctor/login
router.post('/login',Dlogin.post);
router.get('/login',Dlogin.get);

//--doctor/hospitals
router.get('/hospitals', auth.author, hospitals.get);

//--doctor/patients/
router.post('/patients', auth.author, patients.post);
module.exports = router;