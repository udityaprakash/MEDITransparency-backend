const doctorDB = require("../../database/doctor");
const hospitalDB = require("../../database/hospital");
const patientDB = require("../../database/patient");
const recordDB = require("../../database/medicalrecord");
const {compressor} = require('../../Auth/File_Validators/imagefile');
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const patient = require("../../database/patient");

let create = {
    medicalrecord: async (req,res)=>{
        try {
            const id = req.userId;
            const {p_id,d_id,title,desc} = req.body;
            const { originalname, buffer, mimetype } = req.file;
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
            var result = await hospitalDB.findById(id,'all_doctor_ids');
            // console.log(image);
            if (!result || !buffer || !title || !desc) {
                res.status(404).json({ success:false, msg: 'Invalid hospital or no image doc provided or fields missing'});
            }else{

                var patientdetails = await patientDB.findById(p_id);
                let exist = false;
                var docids = result.all_doctor_ids;
                // console.log(docids);
                for(let i=0;i < docids.length; i++){
                    if(d_id == docids[i]){
                        exist = true;
                        break;
                    }
                }

                if(!patientdetails || !exist){
                    res.json({ success:false, msg: 'Invalid patient id or doctor doesnt exist in this hospital'});
                }else{
                    if(allowedMimeTypes.includes(mimetype)){

                        const compressedImageBuffer = await compressor(buffer);
                        
                        const doc = new recordDB({
                            patient_id:p_id,
                            doctor_id:d_id,
                            hospital_id:id,
                            title:title,
                            desc:desc,
                            p_priscription_photo:{
                                name:originalname,
                                data:compressedImageBuffer,
                                contentType:mimetype
                            }

                        })
                        
                        await doc.save().then(async (data)=>{
                            await patientDB.findByIdAndUpdate(p_id,{
                                $push:{ medical_history: { medicalrecord_id: data._id }}
                            }).then((se)=>{
                                res.status(400).json({
                                    success:true,
                                    msg:"record was successfully created"
                                });

                            }).catch((err)=>{
                                res.status(400).json({
                                    success:false,
                                    error:err,
                                    msg:"an error occured"
                                });
                            })
                        }).catch((err)=>{
                                console.log(err);
                                res.status(400).json({
                                    success:false,
                                    error:err,
                                    msg:"an error occured"
                                });
                        });
                    }else{
                        res.json({ success:false , msg: 'invalid image file type'});
                    }

                }


            }
        
        } catch (error) {
            console.error(error);
            res.status(500).json({success:false, msg: 'Internal server error.' });
        }
    }

}



module.exports = {create};