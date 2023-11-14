const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema= new mongoose.Schema({
    patient_id:{
        type: Schema.Types.ObjectId,
        ref: 'patient'
      },
    hospital_id:{
          type: Schema.Types.ObjectId,
          ref: 'hospital'
    },
    doctor_id:{
        type: Schema.Types.ObjectId,
        ref: 'doctor'
    },
    title:String,
    desc:String,
    p_priscription_photo:{
        name: String,
        data: Buffer,
        contentType: String,
    }
   
}, { timestamps: true });

module.exports = mongoose.model("p_medicalrecord" , schema);