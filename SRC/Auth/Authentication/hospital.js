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
        
        const doctorids = req.body.doctorids;
        // var user;
        var notaddeddoctors=[];
        // console.log(req.body);
        try{
            var result = await hospitalDB.findById(id);
            if(!result){
                // console.log(user);
                res.status(200).json({
                    success:false,
                    msg:"no such hospital exixt."
              });
                
            }else{
                var doctlist = result.all_doctor_ids;
                for (let i=0 ;i<doctorids.length;i++){
                    console.log("doctor ids :"+doctorids[i]);
                    
                    doctlist.push(doctorids[i]);
                    await doctorDB.findByIdAndUpdate(doctorids[i], { 
                        $push: { all_hospitals: id }, 
                    }).then((user)=>{
                        console.log(user);
                    }).catch( (e)=>{
                        notaddeddoctors.push(doctorids[i]);
                        console.log("error :"+e);
                    });
                    
                }
                await hospitalDB.findByIdAndUpdate(id, {
                    
                    all_doctor_ids: doctlist,
                    
                }).then((user)=>{
                }).catch( (e)=>{
                    console.log("here error occured :");
                    console.log(e);
                });

            }
            res.status(200).json({
                  success:true,
                  errdetails:{
                    count:notaddeddoctors.length,
                    notadded:notaddeddoctors
                  },
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
        var result;
        try{

            result = await hospitalDB.findById(id);
        }catch(e){

            console.log(e);
        }
        
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
                            if(patientlist[i] == patientid){
                                ispatient = true;
                                break;                                
                            }
                        }
                        if(ispatient){
                            let haspatient = false;
                            var patients_of_doctor = result.doctors;
                            for(let i=0;i<patients_of_doctor.length;i++){
                                if(patients_of_doctor[i].doctor_id == doctorid){
                                    haspatient = true;
                                    break;
                                }
                            }
                            if(haspatient){
                                console.log("has");
                                var currentlist = result.doctors;

                                for(let j=0 ;j<currentlist.length;j++){
                                    if(currentlist[j].doctor_id == doctorid){
                                        currentlist[j].patients.push( patientid );
                                        break;
                                    }
                                }
                                await hospitalDB.findByIdAndUpdate(id,{
                                    doctors: currentlist
                                }).then((user)=>{
                                    console.log("updated");
                                    res.json({
                                        success:true,
                                        users:user.doctors,
                                        msg:"data added"
                                    });
                                }).catch((err)=>{
                                    res.json({
                                        success:false,
                                        error:err,
                                        msg:"was an error"
                                    });
                                });;
                            }else{
                                console.log("not has");
                                var liste = [ patientid ];
                                await hospitalDB.findByIdAndUpdate(id,{
                                    $push: {doctors: { doctor_id: doctorid, patients: liste  } }
                                }).then((user)=>{
                                    console.log("updated");
                                    res.json({
                                        success:true,
                                        users:user,
                                        msg:"data added"
                                    });
                                }).catch((err)=>{
                                    res.json({
                                        success:false,
                                        error:err,
                                        msg:"was an error"
                                    });
                                });
                                
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

let hlogin = async(req , res) => {
    let id = req.body.id;
    let token = await jwt.sign({ id:id }, process.env.SECRET_KEY );
    console.log("token is :"+token);
    res.json({
        success:true,
        hospital_token:token,
        msg:"hospital Registered Successfully"
    });
}



module.exports = {Hsignup, config, hlogin};