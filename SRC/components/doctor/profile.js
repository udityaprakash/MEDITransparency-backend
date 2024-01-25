const doctorDB = require("../../database/doctor");
const patientDB = require("../../database/patient");

const recordDB = require("../../database/medicalrecord");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const {compressor} = require("../../Auth/File_Validators/imagefile");

let Docprofile = {
    setup: async (req,res)=>{
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
              
                  await doctorDB.findByIdAndUpdate(id ,{
                      doctor_photo:{
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
            

        }catch{
            res.status(500).json({ err:error, msg: 'Unsupported image format', });
        }
    },
    sendphoto:async (req,res)=>{
        try {
            const id = req.params.id;
            const image = await doctorDB.findById(id,'doctor_photo');
            // console.log(image);
            if (!image) {
                res.status(404).json({ error: 'Not found' });
            }else{
                res.setHeader('Content-Type', image.doctor_photo.contentType);
                res.send(image.doctor_photo.data);
            }
        
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error.' });
          }
    },
    profile:async (req,res)=>{
        try {
            const id = req.userId;
            var result = await doctorDB.findById(id,'doctor_name , phone_number');
            // console.log(result);
            if (!result) {
                res.status(404).json({
                    success:false,
                    msg: 'Not found' 
                });
            }else{
                res.json({
                    success:true,
                    data:{
                        id:result._id,
                        name:result.doctor_name,
                        number:result.phone_number,
                        imgurl:"https://meditransparency.onrender.com/doctor/photo/"+result._id,
                    },
                    msg:"Doctor Details"
                });
            }
        
          } catch (error) {
            console.error(error);
            res.status(500).json({
                success:false,
                error:error,
                msg: 'Internal Server Error'
            });
          }
    },
    patientprofile: async(req,res)=>{
        const id = req.userId;
        const {patientid} = req.body;
        try{
            var result = await patientDB.findById( patientid ,'general_details , patient_name , phone_number');
            if(!result){
                res.json({
                    success:false,
                    msg: 'No such patient found'
                });
                
            }else{
                let modifiedData;
                if (result.general_details && typeof result.general_details === 'object') {
                    // Process data and replace null values with "--"
                    modifiedData = { ...result.general_details };
              
                    // Define the properties you want to check and set to "--" if null
                    const propertiesToCheck = ['dob','weight','location','city','state','country','bloodGroup'];
              
                    // Check and set null properties to "--"
                    propertiesToCheck.forEach(property => {
                      if (modifiedData[property] === undefined || modifiedData[property] == '') {
                        modifiedData[property] = '--';
                      }
                    });
                }
                  result.general_details = modifiedData;            

                res.json({
                    success:true,
                    msg: 'user info',
                    imgurl: "https://meditransparency.onrender.com/user/photo/"+result._id,
                    details:result
                });
            }

        }catch(error){
            console.error(error);
            res.status(500).json({
                success:false,
                error:error,
                msg: 'Internal Server Error'
            });
        }
    },
    medicalrecordlatest5 :async (req , res)=>{
        const id = req.userId; 
        const {p_id} = req.body;
        var result =await patientDB.findById(p_id,'medical_history');
        console.log(result);
        if(!result){
            res.json({
                success:false,
                msg:"no such patient found"
            });
        }else{
            var arr = [];
            let listlen;
            let hist = result.medical_history;
            console.log(hist);
            (hist.length > 5)? listlen = 5 : listlen = hist.length;
            console.log(listlen);
            for(let i=0; i < listlen; i++){
                var tile = {};
                var rec = await recordDB.findById(result.medical_history[i].medicalrecord_id,'title , desc , createdAt');
                if(rec){
                    Object.assign(tile, {imgurl: "https://meditransparency.onrender.com/user/medicalrecord/"+rec._id});
                    Object.assign(tile, {title: rec.title});
                    Object.assign(tile, {discription: rec.desc});
                    Object.assign(tile, {createdat: rec.createdAt});
                    arr.push(tile);

                }
            }
            res.json({
                success:true,
                msg:"data was send successfully",
                count:listlen,
                data:arr
            });


        }

    }

}



module.exports = {Docprofile};