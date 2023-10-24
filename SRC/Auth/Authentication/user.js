const patient = require('../../database/patient');
const bcrypt = require('bcrypt');
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
                    const pat = new patient({
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
    post:(req,res)=>{
        let {mobileno , password} = req.body;
        
        console.log(req.body);
    }

}



module.exports = {psignup,plogin};