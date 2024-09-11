import mongoose from 'mongoose';

const accountSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required:true
        },
        role:{
            type: String,
            required: true,
            default: "user"
        },
        verificationCode:{
            type: String,
            required: true
        },
        verified:{
            type: Boolean,
            default: false
        }
    },
    {
        timestamps:true
    }
);

export const Account = mongoose.model('Account', accountSchema );