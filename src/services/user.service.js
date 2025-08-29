import userEmail from "../email/user.email.js"
import CustomError from "../errors/custom.error.js"
import { User } from "../models/user.model.js"
import { comparePassword, generateOtpExpiry, hashPassword, otpCode } from "../utils/helper.utils.js"


class UserService {

    createUserService = async(username, email, password) =>{
        try {
            const otp = otpCode()
            const otpExpiry = generateOtpExpiry()
            const hashedPassword = hashPassword(password)

            const user = await User.create({
                username,
                email,
                password:hashedPassword,
                otp,
                otpExpiry
            })
            userEmail.sendOtp('Account Verification', email, username, otp)
            return user
        } catch (error) {
            if(error.code === 11000){
                throw new CustomError('User already exists', 400)
            }

            throw new CustomError("Failed To Create User", 500)
        }
    }


    #emailExists = async(email) =>{
        const emailExists = await User.findOne({email})
        return !!emailExists
    }

    
    #getUserEmail = async(email) => {
        const emailExists = await User.findOne({email})
        return emailExists
    }

    loginUserService = async(email, password) => {
        try {
            const emailExists = await this.#emailExists(email)
            
            if(!emailExists){
                throw process.env.NODE_ENV !== 'production' ? new CustomError("Email Not Found", 404) : new CustomError("Invalid Credentials", 401)
            }
            
            const user = await this.#getUserEmail(email)
            console.log('user Details =>', user)
            
            const isMatch = comparePassword(password, user.password)

            if(!isMatch){
                throw new CustomError("Invalid Credentials", 401)
            }

            if(!user.status){
                throw new CustomError("Account Not Verified Kindly Verify your account to login...", 401)
            }

            if(user.banned){
                throw new CustomError("Sorry... Your account has been banned. You can Appeal this Ban Using their Support Email", 403)
            }
            return user


        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw process.env.NODE_ENV !== 'production' ? new CustomError(error.message, error.statusCode || 500, error.stack) : new CustomError(error.message, error.statusCode || 500)
        }
    }


    activateAccountService = async(otp, email) => {
        try {
            const user = await this.#getUserEmail(email)

            if(!user){
                throw new CustomError("User Not Found", 404)
            }

            if(user.otp !== otp){
                throw new CustomError("Invalid OTP", 400)

            }

            if(user.status) {
                throw new CustomError("Account Already Activated", 400)
            }

            if(user.otpExpiry < new Date()){
                throw new CustomError("OTP Expired, Please Request a New One", 400)
            }
            user.status = true
            user.otp = null
            user.otpExpiry = null
            await user.save()
            return user
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(error.message, error.statusCode || 500)
            
        }
    }

    /* 
        resend of otp 
        this function helps to resend the OTP if the user's otp has expired
        @params {string} email - The email of the user requesting a new OTP

    */

    resendOtpService = async(email) =>{
        try {
            const user = await this.#getUserEmail(email)

            if(!user){
                throw new CustomError("User Not Found", 404)
            }

            if(user.status){
                throw new CustomError("Account Already Activated", 400)
            }

            if(user.otpExpiry > new Date()){
                throw new CustomError("OTP Still Valid, Kindly Use the previous OTP sent to your Email...", 400)
            }

            const otp = otpCode()
            user.otp = otp
            const otpExpiry = generateOtpExpiry()
            user.otpExpiry = otpExpiry
            await user.save()
            await userEmail.sendOtp('Resend OTP', email, user.username, otp)
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message, error.statusCode || 500);
        }
    }
}

const userService = new UserService()

export default userService