const doctorDB = require("../../database/doctor");
const hospitalDB = require("../../database/hospital");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");

let hospitals = {
    get: async (req,res)=>{
        let id = req.userId;
        const result = await doctorDB.findOne({ _id: id},'all_hospitals');
        // console.log(result);
        var list=[];
        for(var i=0; i < result.all_hospitals.length; i++){
            var det, jes = {};
            det = await hospitalDB.findById(result.all_hospitals[i],'hopital_name');
            // console.log(det);
            Object.assign(jes, {imgurl: "https://meditransparency.onrender.com/hospital/logo/"+det._id});
            Object.assign(jes, {name: det.hopital_name});
            Object.assign(jes, {id: det._id});
            // console.log(jes);
            // const mergedObj = Object.assign({}, det, jes);
            list.push(jes);
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