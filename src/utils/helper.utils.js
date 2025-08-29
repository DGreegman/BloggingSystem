import bcrypt from "bcryptjs";
import {randomInt} from "crypto"
import jwt from "jsonwebtoken";
import CustomError from "../errors/custom.error.js";

export const  hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword
}

export const otpCode = () =>{
    const otp = randomInt(100000, 999999)
    return otp
} 

export const comparePassword = (userPassword, hashedPassword)=>{
    const isMatch = bcrypt.compareSync(userPassword, hashedPassword)
    return isMatch
}

export const generateOtpExpiry = () => {
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 5);
    return otpExpires;
}

export const generateToken = (user, userId) => {
    const secretKey = process.env.JWT_SECRET;
    if(!secretKey){
        throw new CustomError("Secret Key not set...", 401)
    }
    const token = jwt.sign({user, userId}, secretKey, {
        expiresIn: '1d'
    })

    return token 
}


// export const nameFunction = (firstname, lastname) =>{
//     return {firstname, lastname}
    
// }

// let {firstname, lastname }= nameFunction('diftrak', 'singh')

// console.log(firstname, lastname)