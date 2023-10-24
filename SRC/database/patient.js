const mongoose = require("mongoose");

const schema= new mongoose.Schema({
    patient_name : {
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
    dateofadmit: Date,
    age:Number,
    sex:{
            type:String,
            length:1
    }, 
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