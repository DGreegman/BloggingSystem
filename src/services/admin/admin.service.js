import mongoose from "mongoose";
import CustomError from "../../errors/custom.error.js";
import { Blog } from "../../models/blog.model.js";
import { User } from "../../models/user.model.js";
import userEmail from "../../email/user.email.js";
class AdminService {

    deletePost = async(blogId) =>{
        try {
            if(!mongoose.Types.ObjectId.isValid(blogId)){
                throw new CustomError('Invalid Blog Post ID', 400);
            }
            await Blog.findByIdAndDelete(blogId);
        } catch (error) {
            throw new CustomError(`Failed To Delete Blog Post ${error.message}`, 500);
        }
    }

    banUser = async(userId) => {
        try {
            if(!mongoose.Types.ObjectId.isValid(userId)){
                throw new CustomError('Invalid User ID', 400);
            }

            const userExists = await User.findById(userId);
            if(!userExists){
                throw new CustomError('User Not Found', 404);
            }

            const updatedBannedUser = await User.findByIdAndUpdate(userId, { banned: true }, {new: true});

            console.log(updatedBannedUser.banned, 'Service Banned User')
            await userEmail.sendOtp('Account Banned', userExists.email, userExists.username);
            return updatedBannedUser;


        } catch (error) {
            throw new CustomError(`Failed To Ban User ${error.message}`, 500);
        }
    }

    unBanUser = async(userId) =>{
        try {
            if(!mongoose.Types.ObjectId.isValid(userId)){
                throw new CustomError('Invalid User ID', 400);
            }

            const userExists = await User.findById(userId);
            if(!userExists){
                throw new CustomError('User Not Found', 404);
            }

            const updatedBannedUser = await User.findByIdAndUpdate(userId, { banned: false }, {new: true});

            console.log(updatedBannedUser.banned, 'Service Unbanned User')
            await userEmail.sendOtp('Account Unbanned', userExists.email, userExists.username);
            return updatedBannedUser;

        } catch (error) {
            throw new CustomError(`Failed To Un-ban User ${error.message}`, 500);
        }
    }
}

const adminService = new AdminService();
export default adminService;