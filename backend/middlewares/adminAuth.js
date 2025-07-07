import jwt from 'jsonwebtoken'
import Admin from '../models/adminModel.js'

//admin authentication middleware logic
const adminAuth = async(req,res,next) => {
    try{
         const {atoken} = req.headers
         if(!atoken) {
            return res.json({success:false,message:"Unauthorized Access! Login Again :)"});
         }
         
         try {
             // Try to verify as new JWT format
             const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
             
             if (decoded.adminId && decoded.email) {
                 // New format - check if admin exists and is active
                 const admin = await Admin.findById(decoded.adminId).select('-password');
                 if (admin && admin.isActive) {
                     req.adminId = admin._id;
                     req.adminEmail = admin.email;
                     req.admin = admin;
                     return next();
                 }
             }
             
             // Fallback to old format for backward compatibility
             if(decoded === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                 return next();
             }
             
             return res.json({success:false,message:"Unauthorized Access! Login Again :)"});
             
         } catch (jwtError) {
             // If JWT verification fails, try old format
             if(atoken === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                 return next();
             }
             
             return res.json({success:false,message:"Invalid token! Login Again :)"});
         }
    }
    catch(error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export default adminAuth