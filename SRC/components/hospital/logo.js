const hospitalDB = require("../../database/hospital");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const patient = require("../../database/patient");

let logo = {
    logosend:async (req,res)=>{
        try {
            const id = req.params.id;
            const image = await hospitalDB.findById(id,'hospital_logo');
            // console.log(image);
            if (!image) {
                res.status(404).json({ error: 'Not found' });
            }else{
                res.setHeader('Content-Type', image.hospital_logo.contentType);
                res.send(image.hospital_logo.data);
            }
        
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error.' });
          }
    }

}



module.exports = {logo};