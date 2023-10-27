const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderoptions = ['M','F'];
const schema= new mongoose.Schema({
    patient_name : {
     type:String,
    },
    patient_photo:{
      name: String,
      data: Buffer,
      contentType: String,
    },
    phone_number : {
      type:Number,
      min:10,
      required:true
     },
    password: {
        type:String,
        min:8,
        require:true
    },
    general_details:{
      dob:{type:Date},
      gender:{
        type: String,
        enum: genderoptions
      },
      location:{type:String},
      city:{type:String},
      state:{type:String},
      country:{type:String},
      bloodGroup: {
        type: String,
        enum: bloodGroupOptions
      }
      
    },
    medical_history:[
      {
        hospital_id:{
          type: Schema.Types.ObjectId,
          ref: 'hospital'
        },
        title:String,
        disc:String,
        timestamps: { 
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        }
      }
    ], 
    otp:{
      type:Number,
      default:null
    },
    is_verified:{
      type:Boolean,
      default:false
    }
}, { timestamps: true });

module.exports = mongoose.model("patient" , schema);