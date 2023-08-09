import aqp from "api-query-params";
import User from '../models/User.js';
import { generateCode, hash, safeGet, setLimit, generateOtp } from "../util/helpers.js";


const module = 'User';

export const fetchService = async (query) => {
    try{
        let { filter, skip, population, sort, projection } = aqp(query);
        const searchString = filter.q ? filter.q : false;
        if (searchString) {
            const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            filter.$or = [
              { email: { $regex: new RegExp(searchString, "i") } },
              { phoneNumber: { $regex: new RegExp(searchString, "i") } },
              { fullName: { $regex: new RegExp(searchString, "i") } },
              { $text: { $search: escaped, $caseSensitive: false } },
            ];
            delete filter.q;
          }
        let { limit } = aqp(query);
        limit = setLimit(limit);
        if (!filter.deleted) filter.deleted = 0;

        const total = await User.countDocuments(filter).exec();


        const result = await User.find()
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