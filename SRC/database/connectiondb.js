const mongoose = require("mongoose");
const patient = require('../database/patient');
const doctor = require('../database/doctor');
const admin = require('../database/adminschema');
require('dotenv').config();
var i,j,k = 0;
const connectDB =  {
            patientconnection: async () => {
                // await mongoose.set("strictQuery", false);
                await mongoose.connect(process.env.MONGODB_URL,  {useNewUrlParser: true, useUnifiedTopology: true }
                ).then(()=>console.log("patient db connected successfully")
                ).catch((e)=>{
                  console.log(`Error while connection patient, Retrying ${i++}`);
                  connectDB.patientconnection();
                });
            },
            doctorconnection: async () => {
                // await mongoose.set("strictQuery", false);
                await mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true }
                  ).then(()=>console.log("doctor db connected successfully")
                  ).catch((e)=>{
                    console.log(`Error while connection doctor, Retrying ${j++}`);
                    connectDB.doctorconnection();
                  });
                },
                adminconnection: async () => {
                    // await mongoose.set("strictQuery", false);
                    await mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true }
                      ).then(()=>console.log("admin connected successfully")
                      ).catch((e)=>{
                        console.log(`Error while connection admin, Retrying ${k++}`);
                        connectDB.adminconnection();
                      });
                    }
            
          }
          
          
module.exports=connectDB;