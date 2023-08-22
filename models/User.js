import mongoose from "mongoose";
import Joi from "joi";
import { DATABASE, GENDER, USER_TYPE } from "../constant/index.js";


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
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required()
    // isAdmin: Joi.boolean().required()
});

export const validateUpdateUser = Joi.object({
    userType: Joi.string().valid(...Object.values(USER_TYPE)).optional(),
    fullName: Joi.string().optional(),
    regNumber: Joi.string().min(11).max(11).optional(),
    employeeId: Joi.string().optional(),
    age: Joi.number().optional(),
    gender: Joi.string().valid(...Object.values(GENDER)).optional(),
    dob: Joi.date().optional(),
    address: Joi.string().max(150).optional(),
    phoneNumber: Joi.string().max(11).optional(),
    photo: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional(),
    isAdmin: Joi.boolean().optional(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional()
});

export const validateAdminUpdate = Joi.object({
    userType: Joi.string().valid(...Object.values(USER_TYPE)).optional(),
    fullName: Joi.string().optional(),
    regNumber: Joi.string().min(11).max(11).optional(),
    employeeId: Joi.string().optional(),
    age: Joi.number().optional(),
    gender: Joi.string().valid(...Object.values(GENDER)).optional(),
    dob: Joi.date().optional(),
    address: Joi.string().max(150).optional(),
    phoneNumber: Joi.string().max(11).optional(),
    photo: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional(),
    isAdmin: Joi.boolean().optional(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional()
});

export const validateLogin = Joi.object({
    // userType: Joi.string().valid(...Object.values(USER_TYPE)).required(),
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
        select: true,
    },
    regNumber: {
        type: String,
        select: true,
        min: 11,
        max: 15,
    },
    employeeId: {
        type: String,
        select: true,
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
        type: String,
        require: true,
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
    },
    createdAt: {
        type: Date,
        select: true,
    },
    updatedAt: {
        type: Date,
        select: true,
    },
    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: true },
},
{
    timestamps: true
});

// UserSchema.add('collection', 'User');
UserSchema.set('collection', 'User');

export default mongoose.model("User", UserSchema);