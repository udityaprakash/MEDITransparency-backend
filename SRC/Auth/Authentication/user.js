const patientDB = require('../../database/patient');
const bcrypt = require('bcrypt');
const {compressor} = require('../File_Validators/imagefile');
const jwt = require("jsonwebtoken");
require('dotenv').config()
let psignup = {
    post:async (req,res)=>{
        try{

            let { patientname, phonenumber, password } = req.body;
            // console.log(req.body);
            if(!patientname || !phonenumber || !password){
                res.json({
                    success:false,
                    msg:"All fields are required"
                });
            }
            else{
                if(phonenumber.length!=10){
                    res.json({
                        success:false,
                        msg:"Phonenumber must be 10 digit only"
                    });
                }else{
                    
                    const salt= parseInt(process.env.SALTLEN);
                    hashedpassword = await bcrypt.hash(password, salt);
                    console.log("password:"+hashedpassword);
                    patientname = patientname.toLowerCase();
                    const pat = new patientDB({
                        patient_name:patientname,
                        phone_number:phonenumber,
                        password:hashedpassword
                    });
                    await pat.save().then((user)=>{
                        res.status(200).json({
                          success:true,
                          patient_id:user._id,
                          msg:"User Recorded Successfully"
                        });
                    });

                }
            }
        }catch{
            res.send({success:false,message:'Error in SignUp'})
        }
    },
    get:(req,res)=>{
        console.log("success for get method");
        res.json({
            success:true,
            msg:"server is ready to signup for users"
        });
    }

}
let plogin = {
    post:async(req,res)=>{
        let {mobileno , password} = req.body;
        if(!mobileno || !password){
            res.json({
                success:false,
                msg:"Some Fields are Missing"
            })
        }else{
            const result = await patientDB.findOne({ phone_number: mobileno});
            if(result != null){
                const match =await bcrypt.compare(password, result.password);
                console.log(match);
                if(match){
                    let token = jwt.sign({ id:result._id}, process.env.SECRET_KEY);
                    res.status(200).json({
                    success:true,
                    token:token,
                    msg:"Successfull patient Login"
                    });
                }else{
                    res.json({
                        success:false,
                        msg:"Incorrect Password! Please try again"
                    })
                }

            }else{
                res.json({
                    success:false,
                    msg:"Incorrect Phone Number or Password! Please try again"
                })
            }
            }
    }

}

let setupprofile = {
    image:async (req , res)=>{
        try {
            if (!req.file) {
              return res.status(400).json({success:false, error: 'No file uploaded.' });
            }
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
            const id = req.userId;
            const { originalname, buffer, mimetype } = req.file;
            if(allowedMimeTypes.includes(mimetype)){
                // Resize the image to 500 pixels width (maintaining aspect ratio)
                
                const compressedImageBuffer = await compressor(buffer);
            
                await patientDB.findByIdAndUpdate(id ,{
                    patient_photo:{
                        name: originalname,
                        data: compressedImageBuffer,
                        contentType: mimetype,
                    }
                }).then(async (user)=>{
                    res.json({ message: 'Image uploaded successfully.' });
                }).catch((err)=>{
                        console.log(err);
                        res.status(400).json({
                            success:false,
                            error:err,
                            msg:"an error occured"
                        });
                });
            
                
        
            }else{
                res.json({ message: 'Not a png , jpg, heic, or jpeg file.' });
            }
          } catch (error) {
            res.status(500).json({ err:error, msg: 'Unsupported image format', });
          }

    },
    userinfo:async (req,res)=>{

        try{
            const id = req.userId;
            const genderoptions = ['M', 'F'];
            let {gender, 
                // dobyear, dobmonth , 
                dob
                ,weight ,bloodgrp, location} = req.body;
            var dobt = new Date( dob );
            // console.log(dobt.getDate(), dobt.getMonth());
            if( !dob || !gender || !weight || !bloodgrp || !location){
                res.json({
                    success:false,
                    msg:"All fields are required"
                });
            }
            else{
                // console.log("here");
                // console.log(id, genderoptions.includes(gender));
                if(genderoptions.includes(gender)){
                    await patientDB.findByIdAndUpdate( id,{
                        
                        // patient_name: patientname,
                        
                        general_details:{
                            gender:gender,
                            dob: dobt,
                            weight:weight,
                            location:location,
                            bloodGroup:bloodgrp
                        }
                        
                    }).then(async (user)=>{
                        console.log("data saved");
                        let token = await jwt.sign({ id:user._id }, process.env.SECRET_KEY );
                        console.log("token is :"+token);
                        res.json({
                          success:true,
                          patient_token:token,
                          msg:"patient profile was Successfully setup"
                        });
                    }).catch((err)=>{
                            console.log(err);
                            res.status(400).json({
                                success:false,
                                error:err,
                                msg:"an error occured"
                            });
                    });
                }else{
                    res.send({success: false, msg:'type M or F only for gender'});

                }
                // patientname = patientname.toLowerCase();
                    
                
            }
        }catch(err){
            res.send({success:false,error:err,message:'Error in Setting Up profile'});
        }
    }
}



module.exports = {psignup, plogin, setupprofile};