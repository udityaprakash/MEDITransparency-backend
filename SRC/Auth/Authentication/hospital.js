const hospitalDB = require("../../database/hospital");
const bcrypt = require('bcrypt');
require('dotenv').config()
const {compressor} = require("../File_Validators/imagefile");
const jwt = require("jsonwebtoken");
let Hsignup = {
    post:async (req,res)=>{

        try{

            let { hospitalname,address, phonenumber,nooficubeds,GSTno,yoestablishment} = req.body;
            

            // console.log(phonenumber.length);
            if(!hospitalname || !address || !phonenumber|| !nooficubeds|| !GSTno|| !yoestablishment){
                res.json({
                    success:false,
                    msg:"All fields are required"
                });
            }
            else{
                if(phonenumber.length!=10){
                    return res.send({success: false, msg:'Phone number must be 10 digits'})
                }
                console.log(yoestablishment);
                hospitalname = hospitalname.toLowerCase();
                    const doc = new hospitalDB({
                        hopital_name:hospitalname,
                        phone_number:phonenumber,
                        no_of_icu_beds:nooficubeds,
                        gst_no: GSTno,
                        year_of_establishment: yoestablishment,
                        hospital_address:address,
                    });

                    await doc.save().then(async (user)=>{
                        console.log("data saved");
                        let token = await jwt.sign({ id:user._id }, process.env.SECRET_KEY );
                        console.log("token is :"+token);
                        res.json({
                          success:true,
                          hospital_token:token,
                          msg:"hospital Registered Successfully"
                        });
                    }).catch((err)=>{
                            res.status(400).json({
                                error:err
                            });
                    });
                    
                
            }
        }catch{
            res.send({success:false,message:'Error in SignUp'})
        }
    },
    uploadimg:async (req,res)=>{
        try{
            let id = req.userId;
            
            var logo = req.files['hospitallogo'][0];
            var sign = req.files['sign'][0];
            
            // console.log(phonenumber.length,hospital);
            if(!logo || !sign){
                res.json({
                    success:false,
                    msg:"sign or the logo is missing"
                });
            }
            else{
                logo.buffer =await compressor(logo.buffer);
                sign.buffer =await compressor(sign.buffer);
                
                    await hospitalDB.findByIdAndUpdate(id, { 
                        hospital_logo:{
                            name:logo.originalname,
                            data:logo.buffer,
                            contentType:logo.mimetype
                        },
                        authority_sign:{
                            name:sign.originalname,
                            data:sign.buffer,
                            contentType:sign.mimetype
                        }, 
                    }).then((user)=>{
                        res.status(200).json({
                          success:true,
                          msg:"hospital logo and sign were Registered Successfully"
                        });
                    }).catch((err)=>{
                            res.status(400).json({
                                success:false,
                                error:err
                            });
                    });
                    
                
            }
        }catch{
            res.send({success:false,message:'Error in SignUp'})
        }

    },
    get:(req,res)=>{
        console.log("success for get method");
        res.json({
            success:true,
            msg:"server is ready to signup for doctors"
        });
    }

}



module.exports = {Hsignup};