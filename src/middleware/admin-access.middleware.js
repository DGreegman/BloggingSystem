import CustomError from "../errors/custom.error.js";

class AdminAccess {

    checkAdmin = async(req, res, next) =>{
       try {
             // check if the user exists
        if(!req.user){
            throw new CustomError("Unauthorized, user not found", 404);
        }
        const user = req.user;
        if(user.role !== 'admin'){
            throw new CustomError("Unauthorized, Admin access only", 403)
        }
        next()
       } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
       }
    }
}

const adminAccess = new AdminAccess();
export default adminAccess;