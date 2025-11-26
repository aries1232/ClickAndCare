import jwt from 'jsonwebtoken'

//doctor authentication middleware logic
const authDoctor = async(req,res,next) => {
    try{
         
         const dToken = req.headers.dtoken || req.headers.dToken || req.headers.DToken || req.headers.DTOKEN;
         
         if(!dToken) {
            return res.json({success:false,message:"Unauthorized Access! Login Again"});
         }
         
         const token_decode =jwt.verify(dToken,process.env.JWT_SECRET)
         req.doctor = { id: token_decode.id }
         next()

    }
    catch(error) {
        console.log('AuthDoctor Error:', error.message);
        res.json({success:false,message:error.message});

    }
} 

export default authDoctor
