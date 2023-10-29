const doctorDB = require("../../database/doctor");
const hospitalDB = require("../../database/hospital");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");

async function createimgurl(id){
    try {
        const image = await hospitalDB.findById(id,'hospital_logo');
    
        if (!image) {
          return res.status(404).json({ error: 'Image not found.' });
        }
    
        res.setHeader('Content-Type', image.contentType);
        res.send(image.data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
      }
}

let hospitals = {
    get: async (req,res)=>{
        let id = req.userId;
        const result = await doctorDB.findOne({ _id: id},'all_hospitals');
        console.log(result);
        var list=[];
        for(var i=0; i < result.all_hospitals.length; i++){
            let det = await hospitalDB.findById(result.all_hospitals[i],'hopital_name');
            console.log(det);
            list.push(det);
        }
        res.json({
            success:true,
            count:list.length,
            hospitaldetails:list,
            msg:"all hospitals of doctors"
        });
    }

}



module.exports = {hospitals};