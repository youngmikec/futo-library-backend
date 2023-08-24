import joi from "joi";
import mongoose from "mongoose";
import { DATABASE } from "../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  subscriberEmail: joi.string().email().required(),
  phone: joi.string().min(11).max(11).optional(),
  createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdate = joi.object({
  subscriberEmail: joi.string().email().optional(),
  phone: joi.string().min(11).max(11).optional(),
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const schema = {
  code: { type: String, select: true, trim: true, required: true },
  subscriberEmail: { type: String, select: true, trim: true, required: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);
newSchema.index({ subscriberEmail: 1 }, { unique: true });

newSchema.set("collection", "subscribers");

const Subscribers = mongoose.model("Subscribers", newSchema);

export default Subscribers;