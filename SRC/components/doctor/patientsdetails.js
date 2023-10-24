const doctorDB = require("../../database/doctor");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const patient = require("../../database/patient");

function findHospitalByName(hospitals, name) {
    let alpatients;
    for(let i=0;i<hospitals.length;i++){
        if(hospitals[i].hospital_name == name){
            alpatients = hospitals[i].patients;
        }
    }
    let ids = [];
    for(let i=0;i<alpatients.length;i++){
        ids.push(alpatients[i].patientid);
    }
    return ids;    
  }

function patientdetails(ids){
    
}

let patients = {
    post:async (req,res)=>{
        let id = req.userId;
        let hospital = req.body.hospitalname;
        const result = await doctorDB.findOne({ _id: id});
        // console.log(result.hospitals);
        const patients = findHospitalByName(result.hospitals, hospital);

        console.log(patients);
        res.json({
            success:true,
            details:result.hospitals,
            msg:"all hospitals of doctors"
        });
    }

}



module.exports = {patients};