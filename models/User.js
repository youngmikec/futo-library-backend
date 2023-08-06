import mongoose from "mongoose";
import Joi from "joi";
import { GENDER, USER_TYPE } from "../constant/index.js";


const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;


export const validateRegister = Joi.object({
    userType: Joi.string().valid(...Object.values(USER_TYPE)).required(),
    fullName: Joi.string().required(),
    regNumber: Joi.string().min(11).max(11).optional(),
    employeeId: Joi.string().optional(),
    age: Joi.number().required(),
    gender: Joi.string().valid(...Object.values(GENDER)).required(),
    dob: Joi.date().required(),
    address: Joi.string().max(150).required(),
    phoneNumber: Joi.string().max(11).required(),
    photo: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().required()
});

export const validateLogin = Joi.object({
    userType: Joi.string().valid(...Object.values(USER_TYPE)).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().optional()
});

const UserSchema = new mongoose.Schema({
    id: { type: ObjectId, require: true },
    userType: {
        type: String,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
    },
    regNumber: {
        type: String,
        min: 11,
        max: 11,
    },
    employeeId: {
        type: String,
        min: 3,
        max: 15,
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    address: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: Number,
        require: true,
        max: 11,
    },
    photo: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 8
    },
    points: {
        type: Number,
        default: 0
    },
    activeTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    prevTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

// UserSchema.add('collection', 'User');
UserSchema.set('collection', 'User');

export default mongoose.model("User", UserSchema);