import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js';

export const verifyToken = async(req, res, next) =>{

    const test_token = req.headers.authorization || req.headers.Authorization;
    let token;
    
    if(test_token && test_token.startsWith('Bearer')){
        token = test_token.split(' ')[1];
    }

    if(!token){
        return res.status(403).json({
            status: false,
            message: 'Not authorized, no token provided...'
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded user ID from token:', decoded.userId);
        const user = await User.findById(decoded.userId);
        console.log('User found: => From Middleware', user);

        if(!user){
            return res.status(401).json({
                status: false,
                message: 'Authorization failed, user not found...'
            })
        }
        req.user = user;


        next();
    } catch (error) {
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                status: false,
                message: 'Invalid token...'
            })
        }

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                status: false,
                message: 'Token expired...'
            })

        }

         // Generic error handling
        res.status(500).json({
            status: false,
            message: 'Not authorized, token failed',
            error: process.env.NODE_ENV !== 'production' ? error.message : ''
        });
    }
}