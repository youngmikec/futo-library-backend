import aqp from "api-query-params";
import User from "../models/User.js";
import Book, { validateBookCreate, validateBookUpdate } from '../models/Book.js';
import { generateModelCode, setLimit } from "../util/helpers.js";
import BookCategory from "../models/BookCategory.js";
import { uploadImage } from "../util/upload.js";
import { USER_TYPE } from "../constant/index.js";


const module = 'Book';

export const fetchService = async ({ query, user }) => {
    try{
        let { filter, skip, population, sort, projection } = aqp(query);
        let { limit } = aqp(query);
        limit = setLimit(limit);
      
        // if (!filter.deleted) filter.deleted = false;
        // if (user.userType !== USER_TYPE.ADMIN) {
        //     filter.$or = [{ userType: user.userType }, { createdBy: user.id }];
        // }
        const total = await Book.countDocuments(filter).exec();


        const result = await Book.find(filter)
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

export async function createService(data) {
    try {
        const { error } = validateBookCreate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const { bookImg } = data;
        if(bookImg){
            const uploadResult = await uploadImage(bookImg);
            data.bookImg = uploadResult.url;
        }
        
        data.code = await generateModelCode(Book);
        const senderObj = await User.findById(data.createdBy).exec();
        if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
        data.createdBy = senderObj._id;
        
        const newRecord = new Book(data);
        const result = await newRecord.save();
        if (!result) {
            throw new Error(`${module} record not found.`);
        }
        await BookCategory.updateMany({ '_id': result.categories }, { $push: { books: result._id } });
        return result;
    } catch (err) {
        throw new Error(`Error creating ${module} record. ${err.message}`);
    }
}

export async function updateService(recordId, data, user) {
    try {
        const { error } = validateBookUpdate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedBook = await Book.findById(recordId).exec();
        if (!returnedBook) throw new Error(`${module} record not found.`);
        // if (`${returnedBook.createdBy}` !== user.id) {
        //     throw new Error(`user ${user.email} is not an authorized user`);
        // }
        if (user.userType !== USER_TYPE.ADMIN) {
            throw new Error(`user does not have authorization to update record`);
        }
        // if (`${returnedBook.status}` !== "LOADING") {
        //   throw new Error(`Payment Status is  ${returnedBook.status}`);
        // }

        const { bookImg } = data;
        if(bookImg){
            const uploadResult = await uploadImage(bookImg);
            data.bookImg = uploadResult.url;
        }
        
        const result = await Book.findOneAndUpdate({ _id: recordId }, data, {
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


export async function deleteService(recordId) {
    try {
        // const result = await Book.findOneAndRemove({ _id: recordId });
        const book = await Book.findOne({ _id: recordId })
        const result = await book.remove();
        if (!result) {
            throw new Error(`${module} record not found.`);
        }
        await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
        return result;
    } catch (err) {
        throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
}
