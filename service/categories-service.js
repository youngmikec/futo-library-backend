import aqp from "api-query-params";
import User from "../models/User.js";
import BookCategory, { validateCategoryCreate, validateCategoryUpdate } from '../models/BookCategory.js';
import { generateCode, generateModelCode, setLimit } from "../util/helpers.js";
import { USER_TYPE } from "../constant/index.js";


const module = 'BookCategory';

export const fetchCategoryService = async ({ query, user }) => {
    try{
        let { filter, skip, population, sort, projection } = aqp(query);
        let { limit } = aqp(query);
        limit = setLimit(limit);
      
        // if (!filter.deleted) filter.deleted = false;
        // if (user.userType !== USER_TYPE.ADMIN) {
        //     filter.$or = [{ userType: user.userType }, { createdBy: user.id }];
        // }
        const total = await BookCategory.countDocuments(filter).exec();


        const result = await BookCategory.find(filter)
        .populate(population)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select(projection)
        .exec();

        if(!result){
            throw new Error(`${module} record not found`);
        }
        const count = result.length;
        const msg = `${count} ${module} record(s) retrieved successfully!`;
        return { payload: result, total, count, msg, skip, limit, sort };
    }catch (error){
        throw new Error(`Error retrieving ${module} record ${error.message}`);
    }
}

export async function createCategoryService(data) {
    try {
        const { error } = validateCategoryCreate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }
        
        data.code = await generateModelCode(BookCategory);
        const senderObj = await User.findById(data.createdBy).exec();
        if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
        data.createdBy = senderObj._id;
        
        const newRecord = new BookCategory(data);
        const result = await newRecord.save();
        if (!result) {
            throw new Error(`${module} record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error creating ${module} record. ${err.message}`);
    }
}

export async function updateCategoryService(recordId, data, user) {
    try {
        const { error } = validateCategoryUpdate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedBook = await BookCategory.findById(recordId).exec();
        if (!returnedBook) throw new Error(`${module} record not found.`);
        if (`${returnedBook.createdBy}` !== user.id) {
            throw new Error(`user ${user.email} is not an authorized user`);
        }

        // if (`${returnedBook.status}` !== "LOADING") {
        //   throw new Error(`Payment Status is  ${returnedBook.status}`);
        // }
        
        const result = await BookCategory.findOneAndUpdate({ _id: recordId }, data, {
            new: true,
        }).exec();
        if (!result) {
            throw new Error(`${module} record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error updating ${module} record. ${err.message}`);
    }
}


export async function deleteCategoryService(recordId) {
    try {
        // const result = await Book.findOneAndRemove({ _id: recordId });
        const result = await BookCategory.findOneAndRemove({ _id: recordId })
        if (!result) {
            throw new Error(`${module} record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
}
