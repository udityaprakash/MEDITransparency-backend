const mongoose = require("mongoose");

const schema= new mongoose.Schema({
    hopital_name : {
     type:String,
    },
    phonenumber : {
      type:Number,
      min:10,
      required:true
     },
    doctors:[
        {
            name:{type: String},
            // docid:{type:}
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
});

module.exports =mongoose.model("doctor" , schema);