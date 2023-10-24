const doctorDB = require("../../database/doctor");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");

let hospitals = {
    get:async (req,res)=>{
        let id = req.userId;
        const result = await doctorDB.findOne({ _id: id});
        res.json({
            success:true,
            details:result.hospitals,
            msg:"all hospitals of doctors"
        });
    }

}



module.exports = {hospitals};