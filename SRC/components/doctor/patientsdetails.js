const doctorDB = require("../../database/doctor");
const hospitalDB = require("../../database/hospital");
const patientDB = require("../../database/patient");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const patient = require("../../database/patient");

async function allpatientids(hospitalid, doctorid) {
    const doc = await hospitalDB.findOne({ _id: hospitalid},'doctors');
    // console.log(doctorid);
    let alpatients = [];
    if(doc.doctors.length != 0){
        // console.log('here --' + doc.doctors.length);
        for(let j=0; j<doc.doctors.length; j++){
            if(doc.doctors[j].doctor_id == doctorid){
                alpatients = doc.doctors[j].patients;
                break;
            }
        }
        
    }
    if(alpatients.length != 0){
        return alpatients;
    }
    return [];
  }

async function listgeneratorofpatients(ids){
    try{

        let patientlist = [];
        for (let k = 0; k < ids.length; k++) {
            var det, jes = {};
            var det = await patientDB.findById(ids[k],'patient_photo , patient_name , general_details , createdAt');
            Object.assign(jes, {imgurl: "https://meditransparency.onrender.com/user/photo/"+det._id});
            Object.assign(jes, {name: det.patient_name});
            Object.assign(jes, {patientid: det._id});
            Object.assign(jes, {gender: det.general_details.gender});
            const today = new Date();
            const birthDate = det.general_details.dob;
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            Object.assign(jes, {age: age});
                // console.log(jes);
                // const mergedObj = Object.assign({}, det, jes);
            patientlist.push(jes);

        }
        return patientlist;

    }catch{
        return []
    }
}

let patients = {
    get:async (req,res)=>{
        let id = req.userId;
        console.log(id);
        let hospitalid = req.body.hospitalid;
        try{
            const result = await doctorDB.findOne({ _id: id},'all_hospitals');
            console.log(result);
            var detailedlist;
            if(!result){
                res.status(401).json({success:false, message:"No Such Doctor Found"});
            }else{
                for(let i=0;i<result.all_hospitals.length;i++){
                    if(result.all_hospitals[i] == hospitalid){
                        
                        const patientids =await allpatientids(result.all_hospitals[i], id);
                        detailedlist = await listgeneratorofpatients(patientids);
                        break;

                    }
                }
            }
            
    
            // console.log(patients);
            res.json({
                success:true,
                count:detailedlist.length,
                patientsinfo:detailedlist,
                msg:"All Patients list"
            });

        }catch{
            res.json({
                success:false,
                // details:result,
                msg:"something went wrong"
            });

        }
    }

}



module.exports = {patients};