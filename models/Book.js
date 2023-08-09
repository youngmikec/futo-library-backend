import mongoose from "mongoose";
import Joi from "joi";
import { BOOK_STATUS, DATABASE } from "../constant/index.js";

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

export const validateBookCreate = Joi.object({
    bookName: Joi.string().required(),
    alternateTitle: Joi.string().optional(),
    bookImg: Joi.string().optional(),
    author: Joi.string().required(),
    language: Joi.string().required(),
    publisher: Joi.string().required(),
    bookCountAvailable: Joi.number().required(),
    bookStatus: Joi.string().valid(...Object.values(BOOK_STATUS)).optional(),
    categories: Joi.array().items(Joi.string().regex(DATABASE.OBJECT_ID_REGEX)).required(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
});

export const validateBookUpdate = Joi.object({
    bookName: Joi.string().optional(),
    alternateTitle: Joi.string().optional(),
    bookImg: Joi.string().optional(),
    author: Joi.string().optional(),
    language: Joi.string().optional(),
    publisher: Joi.string().optional(),
    bookCountAvailable: Joi.number().optional(),
    bookStatus: Joi.string().valid(...Object.values(BOOK_STATUS)).optional(),
    categories: Joi.array().items(Joi.string().regex(DATABASE.OBJECT_ID_REGEX)).optional(),
    transactions: Joi.array().items(Joi.string().regex(DATABASE.OBJECT_ID_REGEX)).optional(),
    updatedBy: Joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});


const BookSchema = new mongoose.Schema({
    id: { type: ObjectId, require: true },
    code: {
        type: String,
        required: true,
    },
    bookImg: { 
        type: String,
        required: false
    },
    bookName:{
        type:String,
        require:true
    },
    alternateTitle:{
        type:String,
        default:""
    },
    author:{
        type:String,
        require:true
    },
    language:{
        type:String,
        default:""
    },
    publisher:{
        type:String,
        default:""
    },
    bookCountAvailable:{
        type:Number,
        require:true
    },
    bookStatus:{
        type:String,
        default:"AVAILABLE"
    },
    categories:[{ 
        type: mongoose.Types.ObjectId, 
        ref: "BookCategory" 
    }],
    transactions:[{
        type:mongoose.Types.ObjectId,
        ref:"BookTransaction"
    }],
    createdAt: {
        type: Date,
        select: true,
    },
    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: true },
},
{
    timestamps:true
})

BookSchema.set('collection', 'Book');

export default mongoose.model("Book", BookSchema)