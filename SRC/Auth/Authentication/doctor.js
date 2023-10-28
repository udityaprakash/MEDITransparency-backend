const doctorDB = require("../../database/doctor");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
let Dsignup = {
    post:async (req,res)=>{
        try{
            
            let { doctorname, phonenumber, password } = req.body;
            console.log("here");
            console.log(phonenumber.length);
            if(!doctorname || !phonenumber || !password){
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
                    const doc = new doctorDB({
                        doctor_name:doctorname,
                        phone_number:phonenumber,
                        password:hashedpassword
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
let Dlogin = {
    post:async(req,res)=>{
        let {mobileno , password} = req.body;
        if(!mobileno || !password){
            res.json({
                success:false,
                msg:"Some Fields are Missing"
            })
        }else{
            const result = await doctorDB.findOne({ phone_number: mobileno });
            if(result != null){
                const match =await bcrypt.compare(password, result.password);
                // console.log(match);
                if(match){
                    let token = jwt.sign({ id:result._id}, process.env.SECRET_KEY);
                    res.status(200).json({
                    status:true,
                    token:token,
                    msg:"Successfull Login"
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
    },
    get:(req,res)=>{
        res.json({
            success:true,
            msg:"server is ready to login for doctors"
        });
    }

}



module.exports = {Dsignup,Dlogin};