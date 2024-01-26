const { login , signup , setoffer , getphoto , getoffers ,deletealloffers} = require('../SRC/components/admin/methods');
const router = require("express").Router();
const auth = require("../SRC/Auth/Authorization/authorization");
const {upload} = require("../SRC/Auth/File_Validators/imagefile");

// //--doctor
router.post('/signup',signup);
router.post('/login',login);

router.post('/setoffers', auth.author, upload.single('offer_photo'), setoffer);
router.get('/offer/photo/:id', getphoto);
router.get('/getoffers', getoffers);
router.get('/deletealloffers',auth.author, deletealloffers);

module.exports = router;
