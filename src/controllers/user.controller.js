import CustomError from "../errors/custom.error.js";
import { User } from "../models/user.model.js";
import userService from "../services/user.service.js";
import { generateToken } from "../utils/helper.utils.js";
import { createUserSchema, loginUserSchema } from "../utils/user.schema.js";
class UserController{

    constructor(){
        this.user = userService
    }

    createUser = async(req, res, next) =>{
        try {
            const {error, value} = createUserSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            
            })

            if(error){
                const validationDetails = error.details.map(detail=>({
                    message: detail.message,
                    field: detail.path.join('.')

                }))
                    
                
                throw new CustomError('Validation Error', 400, validationDetails)

            }

            const user = await this.user.createUserService(value.username, value.email, value.password)
            
            res.status(201).json({
                status: true,
                message: 'User Created Successfully',
                data: {
                    email: user.email,
                    username: user.username
                }
            })


        } catch (error) {
            next(error)
        }
    }

    loginUser = async(req, res, next) =>{
        try {
            const {error, value} = loginUserSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            
            })
            if(error){
                const validationDetails = error.details.map(detail =>({
                    message: detail.message,
                    field: detail.path.join('.')
                }))

                throw new CustomError('Validation Error', 400, validationDetails)
            }

            const user = await this.user.loginUserService(value.email, value.password)
            const token = generateToken(user, user._id)
            res.status(200).json({
                token,
                status: true,
                message: 'User Logged In Successfully',

            })
        } catch (error) {
            next(error)
        }
    }

    activateAccount = async(req, res, next) =>{
        try {
            const { otp, email} = req.body;

            await this.user.activateAccountService(otp, email)
            res.status(200).json({
                status: true,
                message: 'Account Activated Successfully',
            })
        } catch (error) {
            next(error)
        }
    }

    resendOtp = async(req, res, next) =>{
        try{
            const { email } = req.body;
            await this.user.resendOtpService(email);
            res.status(200).json({
                status: true,
                message: 'OTP Resent Successfully',
            });
        }catch(error){
            next(error)
        }
    }
    deleteAccount = async(req, res, next) =>{
        try {
            const users = await User.deleteMany()
            res.status(200).json({
                status: true,
                message: 'All Users Deleted Successfully'
            })
        } catch (error) {
            next(error)
        }
    }
}

export const userController = new UserController()
