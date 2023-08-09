import mongoose from "mongoose";
import Joi from "joi";
import { DATABASE, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../constant/index.js";

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

export const validateTransactionCreate = Joi.object({
    bookId: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
    borrowerId: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
    bookName: Joi.string().required(),
    borrowerName: Joi.string().required(),
    transactionType: Joi.string().valid(...Object.values(TRANSACTION_TYPE)).required(),
    fromDate: Joi.date().required(),
    toDate: Joi.date().required(),
    returnDate: Joi.date().required(),
    transactionStatus: Joi.string().valid(...Object.values(TRANSACTION_STATUS)).optional(),
    createdBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
})

export const validateTransactionUpdate = Joi.object({
    bookId: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
    borrowerId: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
    bookName: Joi.string().optional(),
    borrowerName: Joi.string().optional(),
    transactionType: Joi.string().valid(...Object.values(TRANSACTION_TYPE)).optional(),
    fromDate: Joi.date().optional(),
    toDate: Joi.date().optional(),
    returnDate: Joi.date().optional(),
    transactionStatus: Joi.string().valid(...Object.values(TRANSACTION_STATUS)).optional(),
    updatedBy: Joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
})

const BookTransactionSchema = new mongoose.Schema({
    id: { type: ObjectId, require: true },
    code: {
        type: String,
        required: true,
    },
    bookId: {
        type: String,
        ref: "Book",
        require: true
    },
    borrowerId: { //EmployeeId or AdmissionId
        type: String,
        ref: "User",
        require: true
    },
    bookName: {
        type: String,
        require: true
    },
    borrowerName: {
        type: String,
        require: true
    },
    transactionType: { //Issue or Reservation
        type: String,
        require: true,
    },
    fromDate: {
        type: String,
        require: true,
    },
    toDate: {
        type: String,
        require: true,
    },
    returnDate: {
        type: String
    },
    transactionStatus: {
        type: String,
        default: "Active"
    },
    createdAt: {
        type: Date,
        select: true,
    },
    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: true },
},
    {
        timestamps: true
    }
);

BookTransactionSchema.set('collection', 'BookTransaction');

export default mongoose.model("BookTransaction", BookTransactionSchema)