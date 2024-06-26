const express = require("express");
const bodyparser = require("body-parser");
const app = express();
require('dotenv').config()
const connectDB = require("./SRC/database/connectiondb");


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static("public"));

// connectDB.adminconnection();
// connectDB.doctorconnection();
connectDB.patientconnection();


//routes
app.use('/doctor',require('./routers/doctorrouter'));
app.use('/hospital',require('./routers/hospitalrouter'));
app.use('/user',require('./routers/userrouter'));
app.use('/admin',require('./routers/adminrouter'));

const port= process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.json({
      status:200,
      msg:"success"
    });
});

app.listen(port ,()=>{
  console.log("server started "+port);
});