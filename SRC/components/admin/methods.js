const admindb = require('../../database/adminschema');
const offerdb = require('../../database/offers');
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const {compressor} = require("../../Auth/File_Validators/imagefile");

const signup = (req,res) => {
    var {username, mobileNumber, password }= req.body;
    console.log('here i m');
    if (username && mobileNumber && password) {
        if(mobileNumber.length!=10){
            return res.send({success: false, msg:'Phone number must be 10 digits'})
        }
        const salt= parseInt(process.env.SALTLEN);
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                res.status(500).json({ success:false, msg: 'Internal server error' });
            } else {
                username = username.toLowerCase();
                const admin = new admindb({
                    adminname:username,
                    phonenumber:mobileNumber,
                    password:hash
                });
                admin.save().then((user)=>{
                    res.status(200).json({
                        success:true,
                        admin_id:admin._id,
                        msg:"Admin Recorded Successfully"
                    });
                }).catch((err)=>{
                    res.status(400).json({
                        success:false,
                        error:err,
                        msg:"an error occured"
                    });
                });
            }
        });
        
    } else {
        res.status(400).json({ success:false, msg: 'Invalid request some fields are missing' });
    }
};

const login =async (req , res) => {
    var {mobileNumber, password} = req.body;
    if (mobileNumber && password) {
        admindb.findOne({ phonenumber: mobileNumber }).then((user)=>{
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) {
                        res.status(500).json({ success:false, msg: 'Internal server error' });
                    } else {
                        if (result) {
                            const token =jwt.sign({ id: user._id }, process.env.SECRET_KEY);
                            res.status(200).json({
                                success:true,
                                token:token,
                                msg:"Admin Logged in Successfully"
                            });
                        } else {
                            res.status(400).json({ success:false, msg: 'Invalid Credentials' });
                        }
                    }
                });
            } else {
                res.status(400).json({ success:false, msg: 'Invalid Credentials' });
            }
        }).catch((err)=>{
            res.status(400).json({
                success:false,
                error:err,
                msg:"an error occured"
            });
        });
    } else {
        res.status(400).json({ success:false, msg: 'Invalid request some fields are missing' });
    }
};

const setoffer =async (req,res)=>{
    try{
        if (!req.file) {
            return res.status(400).json({success:false, error: 'No file uploaded.' });
          }
          const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
          const id = req.userId;
          const { originalname, buffer, mimetype } = req.file;
          if(allowedMimeTypes.includes(mimetype)){
              // Resize the image to 500 pixels width (maintaining aspect ratio)
              
              const compressedImageBuffer = await compressor(buffer);
            const offerdata = new offerdb({
                adminid: id,
                offer_photo: {
                    name: originalname,
                    data: compressedImageBuffer,
                    contentType: mimetype
                }
            });
              await offerdata.save().then((user)=>{
                res.status(200).json({
                    success:true,
                    msg:"Offer Recorded Successfully"
                });
              }).catch((err)=>{
                res.status(400).json({
                    success:false,
                    error:err,
                    msg:"an error occured"
                });
              });
          
              
      
          }else{
              res.json({ message: 'Not a png , jpg, heic, or jpeg file.' });
          }
        

    }catch{
        res.status(500).json({ err:error, msg: 'Unsupported image format', });
    }
}

const getphoto = async (req,res)=>{
    try{
        const id = req.params.id;
        const offer = await offerdb.findOne({_id:id});
        if(offer){
            res.set('Content-Type', offer.offer_photo.contentType);
            res.send(offer.offer_photo.data);
        }else{
            res.status(404).json({success:false, msg: 'No offer found' });
        }
    }catch{
        res.status(500).json({ err:error, msg: 'Internal server error', });
    }
}

const getoffers = async (req,res)=>{   
    try{
        var offers = await offerdb.find({},{"offer_photo": 0}).sort({createdAt:-1});
        if(offers){
            const currenturl = req.protocol + '://' + req.get('host')+'/admin/offer/photo/';
            var data = [];
            for(let i=0;i<offers.length;i++){
                var field={};
                field['imageurl'] = currenturl+offers[i]._id;
                field['offerid'] = offers[i]._id;
                field['adminid'] = offers[i].adminid;
                field['createdAt'] = offers[i].createdAt;
                data.push(field);
            }
            console.log("photo of "+offers); 
            res.status(200).json({success:true, offers:data });
        }else{
            res.status(404).json({success:false, msg: 'No offer found' });
        }
    }catch{
        res.status(500).json({ err:error, msg: 'Internal server error', });
    }
}

const deletealloffers = async (req,res)=>{
    try{
        const id = req.userId;
        const offers = await offerdb.deleteMany({adminid:id});
        if(offers){
            res.status(200).json({success:true, admin:id, msg: 'All offers deleted of the current admin' });
        }else{
            res.status(404).json({success:false, msg: 'No offer found' });
        }
    }catch{
        res.status(500).json({ err:error, msg: 'Internal server error', });
    }
}

module.exports = {
    signup,
    login,
    setoffer,
    getphoto,
    getoffers,
    deletealloffers
};
