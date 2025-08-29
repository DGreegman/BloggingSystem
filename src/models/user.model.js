import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    otp: {
        type: Number,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    },

    status: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }, 
    banned: {
        type: Boolean,
        default: false
    }   
},
{
    timestamps: true,
    versionKey: false
})

export const User = mongoose.model('User', userSchema)