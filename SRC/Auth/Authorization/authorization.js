const jwt = require('jsonwebtoken');
require('dotenv').config();

const author = (req,res,next)=>{
    try{

        let token = req.headers.authorization;
        if(token){
            try{
                token=token.split(" ")[1];
                let user = jwt.verify(token, process.env.SECRET_KEY);
                req.userId = user.id;
                next();
            }catch(err){
                res.status(401).json({succes:false, msg:"Invalid Token"});
            }
        }
        else{
            res.status(401).json({succes:false, msg:"Header Should Contain Token"});
        }
        
    }catch(error){
        console.log(error);
        res.status(401).json({succes:false,msg:"unauthorized user"});
    }
    
}

const num = 10;

module.exports = { author , num } ;