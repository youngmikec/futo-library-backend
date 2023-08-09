import aqp from "api-query-params";
import User from "../models/User.js";
import Book from '../models/Book.js';
import BookTransaction, { validateTransactionCreate, validateTransactionUpdate } from '../models/BookTransaction.js';
import {  generateModelCode, setLimit } from "../util/helpers.js";


const module = 'BookTransaction';

export const fetchService = async ({ query, user }) => {
    try{
        let { filter, skip, population, sort, projection } = aqp(query);
        let { limit } = aqp(query);
        limit = setLimit(limit);
        const total = await BookTransaction.countDocuments(filter).exec();


        const result = await BookTransaction.find(filter)
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
        const { error } = validateTransactionCreate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }
        
        data.code = await generateModelCode(BookTransaction);
        const senderObj = await User.findById(data.createdBy).exec();
        if (!senderObj) throw new Error(`Sender ${data.createdBy} not found`);
        data.createdBy = senderObj._id;

        const { bookId } = data;
        
        const newRecord = new BookTransaction(data);
        const result = await newRecord.save();

        const returnedBook = Book.findById({ _id: bookId})
        await returnedBook.updateOne({ $push: { transactions: result._id } })
        
        if (!result) {
            throw new Error(`${module} record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error creating ${module} record. ${err.message}`);
    }
}

export async function updateService(recordId, data, user) {
    try {
        const { error } = validateTransactionUpdate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedBook = await BookTransaction.findById(recordId).exec();
        if (!returnedBook) throw new Error(`${module} record not found.`);
        if (`${returnedBook.createdBy}` !== user.id) {
            throw new Error(`user ${user.email} is not an authorized user`);
        }
        
        const result = await BookTransaction.findOneAndUpdate({ _id: recordId }, data, {
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
        // const result = await BookTransaction.findOneAndRemove({ _id: recordId });
        const data = await BookTransaction.findByIdAndDelete({_id: recordId});
        const book = Book.findById(data.bookId)
        await book.updateOne({ $pull: { transactions: recordId } })
        if(!data) throw new Error(`Book request record does not exist`)
        return data;
    } catch (err) {
        throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
}
