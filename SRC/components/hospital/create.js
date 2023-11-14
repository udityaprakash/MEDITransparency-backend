const doctorDB = require("../../database/doctor");
const hospitalDB = require("../../database/hospital");
const patientDB = require("../../database/patient");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const patient = require("../../database/patient");

let create = {
    medicalrecord: async (req,res)=>{
        try {
            const id = req.userId;
            const {p_id,d_id} = req.body;
            var result = await hospitalDB.findById(id,'hopital_name');
            // console.log(image);
            if (!result) {
                res.status(404).json({ success:false, msg: 'Invalid hospital' });
            }else{
                var patientdetails = await patientDB.findById(p_id);
                if(!patientdetails){
                    res.status(404).json({ success:false, msg: 'Invalid patient profile' });
                }else{
                    var det = {};
                    // Object.assign(jes, {imgurl: "https://meditransparency.onrender.com/hospital/logo/"+det._id});
                    // Object.assign(jes, {name: det.hopital_name});
                    // Object.assign(jes, {hospital_id: det._id});

                    res.status(404).json({ error: 'Not found' });
                }


            }
        
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error.' });
          }
    }

}



module.exports = {create};