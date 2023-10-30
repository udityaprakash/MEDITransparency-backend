const patientDB = require("../../database/patient");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const patient = require("../../database/patient");

let patientinfo = {
    picsend:async (req,res)=>{
        try {
            const id = req.params.id;
            const image = await patientDB.findById(id,'patient_photo');
            // console.log(image);
            if (!image) {
                res.status(404).json({ error: 'Not found' });
            }else{
                res.setHeader('Content-Type', image.patient_photo.contentType);
                res.send(image.patient_photo.data);
            }
        
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error.' });
          }
    }

}



module.exports = {patientinfo};