const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema= new mongoose.Schema({
    hopital_name : {
     type:String,
    },
    hospital_logo:{
      name: String,
      data: Buffer,
      contentType: String,
    },
    hospital_address:String,
    phone_number : {
      type:Number,
      min:10,
      required:true
     },
    doctors:[{
      doctor_id:{
        type: Schema.Types.ObjectId,
        ref: 'doctor'
      },
      patients:[{
        type: Schema.Types.ObjectId,
        ref: 'patient'
      }],
      timestamps: { 
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      }
  }],
  all_doctor_ids:[{
    type: Schema.Types.ObjectId,
    ref: 'doctor'
  }],
  no_of_icu_beds:Number,
  gst_no:String,
  authority_sign:{
    name: String,
    data: Buffer,
    contentType: String,
  },
  year_of_establishment:Number,
  patients:Array,
  otp:{
      type:Number,
      default:null
  },
  is_verified:{
      type:Boolean,
      default:false
  }
});

module.exports =mongoose.model("hospital" , schema);