import nodemailer from "nodemailer"
import CustomError from "../errors/custom.error.js"

class UserEmail {
    #emailTransportConfig = async() => {
        const emailUser = process.env.SMTP_USER
        const emailPass = process.env.SMTP_PASS
        if(!emailUser || !emailPass){
            throw new CustomError('Email Configuration Error', 500)
        }
        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPass
            }
        })

        return transport
    }

    #emailTemplate = (username, otp_code) =>{
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Account Verification</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #e0094aff; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .otp-code { 
                    font-size: 24px; 
                    font-weight: bold; 
                    color: #e0094aff; 
                    text-align: center; 
                    background: white; 
                    padding: 15px; 
                    border: 2px dashed #e0094aff; 
                    margin: 20px 0; 
                }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Our Platform!</h1>
                </div>
                <div class="content">
                    <h2>Account Verification Required</h2>
                    <p>Hello ${username},</p>
                    <p>Thank you for registering with us! To complete your account setup, please use the verification code below:</p>
                    
                    <div class="otp-code">${otp_code}</div>
                    
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>This code will expire in 5 minutes</li>
                        <li>Do not share this code with anyone</li>
                        <li>If you didn't request this, please ignore this email</li>
                    </ul>
                    
                    <p>Enter this code in the verification page to activate your account.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message, please do not reply.</p>
                    <p>&copy; ${new Date().getFullYear()} - BlogSystem. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    }

    #resendOtpEmailTemplate = (username, otp_code) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>OTP Re-Sent</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e0094aff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .otp-code { 
                font-size: 24px; 
                font-weight: bold; 
                color: #e0094aff; 
                text-align: center; 
                background: white; 
                padding: 15px; 
                border: 2px dashed #e0094aff; 
                margin: 20px 0; 
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verification Code Re-Sent</h1>
            </div>
            <div class="content">
                <h2>Here’s Your New OTP</h2>
                <p>Hello ${username},</p>
                <p>We noticed you requested a new verification code. Please use the OTP below to complete your account verification:</p>
                
                <div class="otp-code">${otp_code}</div>
                
                <p><strong>Important:</strong></p>
                <ul>
                    <li>This code will expire in 5 minutes</li>
                    <li>Do not share this code with anyone</li>
                    <li>If you did not request a new code, you can safely ignore this email</li>
                </ul>
                
                <p>Enter this code on the verification page to continue with your account setup.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; ${new Date().getFullYear()} - BlogSystem. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    }

    #banUserEmailTemplate = (username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Account Banned</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e0094aff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .ban-box { 
                font-size: 18px; 
                font-weight: bold; 
                color: #e0094aff; 
                text-align: center; 
                background: white; 
                padding: 15px; 
                border: 2px solid #e0094aff; 
                margin: 20px 0; 
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Account Banned</h1>
            </div>
            <div class="content">
                <h2>Hello ${username},</h2>
                <p>We regret to inform you that your account has been <strong>temporarily/permanently banned</strong> from our platform.</p>

                <div class="ban-box">
                    Reason: Violation of our community guidelines
                </div>

                <p>Please note:</p>
                <ul>
                    <li>You will no longer be able to log in or access your account.</li>
                    <li>If you believe this was a mistake, you can contact our support team.</li>
                    <li>Repeated violations may result in permanent suspension.</li>
                </ul>

                <p>We encourage you to carefully review our <a href="#">Community Guidelines</a> before reaching out.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; ${new Date().getFullYear()} - BlogSystem. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    };

    #unbanUserEmailTemplate = (username) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Account Restored</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #28a745; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .unban-box { 
                    font-size: 18px; 
                    font-weight: bold; 
                    color: #28a745; 
                    text-align: center; 
                    background: white; 
                    padding: 15px; 
                    border: 2px solid #28a745; 
                    margin: 20px 0; 
                }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Account Restored</h1>
                </div>
                <div class="content">
                    <h2>Hello ${username},</h2>
                    <p>Good news! 🎉 Your account has been <strong>restored</strong> and you can now access the platform again.</p>

                    <div class="unban-box">
                        Status: Active
                    </div>

                    <p>Please remember:</p>
                    <ul>
                        <li>Ensure to follow our <a href="#">Community Guidelines</a> to avoid future bans.</li>
                        <li>Reach out to our support team if you have any concerns or questions.</li>
                    </ul>

                    <p>We’re happy to have you back!</p>
                </div>
                <div class="footer">
                    <p>This is an automated message, please do not reply.</p>
                    <p>&copy; ${new Date().getFullYear()} - BlogSystem. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
};



    #switchEmailTemplate = (subject, username, otp_code=null) =>{
        if(subject === 'Account Verification'){
            return this.#emailTemplate(username, otp_code)
        }else if(subject === 'Resend OTP'){
            return this.#resendOtpEmailTemplate(username, otp_code)
        }else if(subject === 'Account Banned'){
            return this.#banUserEmailTemplate(username)
        }else if(subject === 'Account Unbanned'){
            return this.#unbanUserEmailTemplate(username)
        }
        // throw new CustomError('Invalid Email Template', 500)
    }
    sendOtp = async(subject, email, username, otp_code=null) =>{
        const transport = await this.#emailTransportConfig()

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject,
            html: this.#switchEmailTemplate(subject, username, otp_code)
        }

        transport.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error.message)
            }else{
                console.log('Email sent: ' + info.response)
            }
        })

        
    }
}

const userEmail = new UserEmail()

export default userEmail