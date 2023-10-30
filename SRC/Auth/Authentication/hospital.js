const hospitalDB = require("../../database/hospital");
const doctorDB = require("../../database/doctor");
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
    adddoctor:async(req,res)=>{

        let id = req.userId;
        console.log(id);

        const doctorids = req.body.doctorids;
        var user;
        // console.log(req.body);
        try{
            for (let i=0 ;i<doctorids.length;i++){
                console.log("doctor ids :"+doctorids[i]);
                
                await hospitalDB.findByIdAndUpdate(id, {
                    
                    $push: { all_doctor_ids: ObjectId(doctorids[i]) },
                    
                }).then((user)=>{
                }).catch( (e)=>{
                    console.log("hee");
                    console.log(e);
                });
                console.log(user);
                
                await doctorDB.findByIdAndUpdate(doctorids[i], { 
                    $push: { all_hospitals: ObjectId(id) }, 
                }).then((user)=>{
                    console.log(user);
                }).catch( (e)=>{
                    console.log(e);
                });

            }
            res.status(200).json({
                  success:true,
                  msg:"doctor was successfully added"
            });
          

        }catch{
            res.send({
                success:false,
                message:'Error in adding doctor'});
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

let config = {
    assignpatient:async (req,res)=>{
        const id = req.userId;
        let {patientid , doctorid}= req.body;
        const result = await hospitalDB.findOneById(id);
        if(!result){
            return res.status(401).json({success:false,msg:"no such hospital exist"});
        }else{
            try{
                let doctorlist = result.all_doctor_ids;
                let patientlist = result.all_patient_ids;
                var isdoctor = false;
                var ispatient = false;

                for(let i=0;i<doctorlist.length;i++){
                    if(doctorlist[i] == doctorid){
                        isdoctor = true;
                        break;

                    }
                }
                if(isdoctor){
                        for(let i = 0;i < patientlist.length; i++){
                            if(doctorlist[i] == doctorid){
                                ispatient = true;
                                break;
                                
                            }
                        }
                        if(ispatient){
                            let haspatient = false;
                            var patients_of_doctor = result.doctors;
                            for(let i=0;i<patients_of_doctor.length;i++){
                                if(patients_of_doctor[i].doctor_Id == doctorid){
                                    haspatient = true;
                                    break;
                                }
                            }
                            if(haspatient){

                                // await hospitalDB.findByIdAndUpdate(id,{
                                    
                                // });
                            }else{
                                // await hospitalDB.findByIdAndUpdate(id,{

                                // });
                            }


                        }else{
                            res.json({
                                success: false,
                                msg:"patient does not belong to this hospital"
                            });
                        }
                        
                }else{
                        res.json({
                            success: false,
                            msg:"doctor does not belong to this hospital"
                        });

            }


            }catch{

            }
        }
        console.log('assign patient');
    }
}



module.exports = {Hsignup,config};