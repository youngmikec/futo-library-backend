import aqp from "api-query-params";
import User, { validateAdminUpdate, validateUpdateUser } from '../models/User.js';
import { generateCode, hash, safeGet, setLimit, generateOtp } from "../util/helpers.js";
import { uploadImage } from "../util/upload.js";


const module = 'User';

// const sendMailService = async (userEmail, subject, message) => {
//     try {
//       const result = await sendMail(
//         "admin@chinosexchange.com",
//         userEmail,
//         subject,
//         message
//       );
//     } catch (err) {
//       console.error(err);
//     }
// };

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

export async function fetchSelfService(query, user) {
    try {
      const { projection, population } = aqp(query);
      console.log('user', user)
      const filter = { _id: safeGet(user, "id") };
      const total = await User.countDocuments(filter).exec();
      const result = await User.findOne(filter)
        .populate(population)
        .select(projection)
        .exec();
      if (!result) {
        throw new Error(`${module} record not found.`);
      }
      const count = result.length;
      const msg = `User record retrieved successfully!`;
      const entity = {
        payload: result,
        total,
        count,
        msg,
        skip: 0,
        limit: 0,
        sort: 1,
      };
      return entity;
    } catch (err) {
      throw new Error(`Error retrieving ${module} record. ${err.message}`);
    }
}

export const updateUserService = async (recordId, data, user) => {
    try {
        const { error } = validateUpdateUser.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedUser = await User.findById(recordId).exec();
        if (!returnedUser) throw new Error(`${module} record not found.`);
        console.log(returnedUser);
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hashSync(data.password, salt);
            data.password = hashedPass;
        }
        if(data.employeeId && returnedUser.userType !== 'ADMIN'){
            throw new Error(`Cannot update employeeId for student. Do you mean reg number?`)
        }
        if(data.regNumber && returnedUser.userType !== 'STUDENT'){
            throw new Error(`Cannot update reg number for Admin Staff. Do you mean employeeId ?`)
        }

        if(data.userType) data.isAdmin = data.userType === 'ADMIN' ?  true : false;
        
        // if (`${returnedUser.createdBy}` !== user.id) {
        //     throw new Error(`user ${user.email} is not an authorized user`);
        // }

        // if (`${returnedBook.status}` !== "LOADING") {
        //   throw new Error(`Payment Status is  ${returnedBook.status}`);
        // }
        
        const result = await User.findOneAndUpdate({ _id: recordId }, data, {
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

export async function updateByUserService(recordId, data) {
    try {
      const { error } = validateUpdateUser.validate(data);
      if (error) throw new Error(`Error validating User data. ${error.message}`);
      if (safeGet(data, "password")) data.password = hash(data.password);
      const { photo } = data;
      if (photo) {
        const uploadResult = await uploadImage(photo);
        data.photo = uploadResult.url;
      } else {
        console.log("no photo image found");
      }
  
      const user = await User.findOneAndUpdate({ _id: recordId }, data, {
        new: true,
      }).exec();
      if (!user) {
        throw new Error(`User record not found.`);
      }
  
      let result = user;
      return result;
    } catch (err) {
      throw new Error(`Error updating User record. ${err.message}`);
    }
}
  
export async function updateByAdminService(recordId, data) {
    try {
        const { error } = validateAdminUpdate.validate(data);
        if (error) throw new Error(`Error validating User data. ${error.message}`);
        if (safeGet(data, "password")) data.password = hash(data.password);
        const result = await User.findOneAndUpdate({ _id: recordId }, data, {
        new: true,
        }).exec();
        if (!result) {
        throw new Error(`User record not found.`);
        }
        return result;
        //! Notify User
    } catch (err) {
        throw new Error(`Error updating User record. ${err.message}`);
    }
}
  


export async function deleteUserService(recordId) {
    try {
        const result = await User.findOneAndRemove({ _id: recordId });
        if (!result) {
            throw new Error(`${module} record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error deleting ${module} record. ${err.message}`);
    }
}