let signup = {
    post:(req,res)=>{
        console.log(req.body);
        res.json({
            success:true,
            msg:"users will be registered"
        });
    },
    get:(req,res)=>{
        console.log("success for get method");
        res.json({
            success:true,
            msg:"server is ready to signup for users"
        });
    }

}
let login = {
    post:(req,res)=>{
        console.log(req.body);
    }

}



module.exports = {signup,login};