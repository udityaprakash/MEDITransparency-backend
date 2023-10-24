const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema= new Schema({
    doctor_name : {
     type:String,
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
    hospitals:[{
        hospital_name:{type:String},
        patients:[{
          patientid:{
            type: Schema.Types.ObjectId,
            ref:'patient'}, 
        }]
    }],
    otp:{
      type:Number,
      default:null
    },
    is_verified:{
      type:Boolean,
      default:false
    }
}, { timestamps: true });

module.exports =mongoose.model("doctor" , schema);