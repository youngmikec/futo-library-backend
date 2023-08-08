import mongoose from "mongoose";
import Joi from 'joi';
import { DATABASE } from "../constant/index.js";

const { ObjectId } = mongoose.Types;

export const validateCategoryCreate = Joi.object({
    categoryName: Joi.string().required(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
})
export const validateCategoryUpdate = Joi.object({
    categoryName: Joi.string().required(),
    books: Joi.array().items(Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")).optional(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
})

// export const validateCategoryUpdate = 

const BookCategorySchema = new mongoose.Schema({
    id: { type: ObjectId, require: true },
    code: {
        type: String,
        required: true,
    },
    categoryName:{
        type:String,
        unique:true
    },
    books:[{
            type: ObjectId,
            ref:"Book"
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

BookCategorySchema.set('collection', 'BookCategory');


export default mongoose.model("BookCategory", BookCategorySchema)