const doctorDB = require("../../database/doctor");
const bcrypt = require('bcrypt');
require('dotenv').config()
const multer = require('multer');
const sharp = require('sharp');
const jwt = require("jsonwebtoken");
let Hsignup = {
    post:async (req,res)=>{

        try{

            let { hospitalname, phonenumber,nooficubeds,GSTno,yoestablishment, hospital } = req.body;
            
            const logo = req.files['hospitallogo'][0];
            const sign = req.files['sign'][0];

            console.log(phonenumber.length,hospital);
            if(!hospitalname || !phonenumber|| !nooficubeds|| !GSTno|| !yoestablishment || !logo || !sign){
                res.json({
                    success:false,
                    msg:"All fields are required"
                });
            }
            else{
                if(phonenumber.length!=10){
                    return res.send({success: false, msg:'Phone number must be 10 digits'})
                }
                    const salt= parseInt(process.env.SALTLEN);
                    hashedpassword = await bcrypt.hash(password, salt);
                    console.log("password:" + hashedpassword);
                    doctorname = doctorname.toLowerCase();
                    // res.json({
                    //     success:true
                    // });
                    const doc = new doctorDB({
                        doctor_name:doctorname,
                        phone_number:phonenumber,
                        password:hashedpassword,
                        hospitals:hospital
                    });
                    await doc.save().then((user)=>{
                        res.status(200).json({
                          success:true,
                          doctor_id:doc._id,
                          msg:"Doctor Recorded Successfully"
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
    get:(req,res)=>{
        console.log("success for get method");
        res.json({
            success:true,
            msg:"server is ready to signup for doctors"
        });
    }

}



module.exports = {Hsignup};