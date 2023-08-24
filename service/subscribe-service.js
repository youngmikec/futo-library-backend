import aqp from "api-query-params";
import Subscribers, { validateCreate, validateUpdate } from "../models/Subscriber.js";
import { generateCode, generateModelCode, setLimit } from "../util/helpers.js";

const module = "Subscriber";

export const fetchService = async (query) => {
  try {
    let { filter, skip, population, sort, projection } = aqp(query);
    const searchQuery = filter.q ? filter.q : false;
    if (searchQuery) {
      const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      filter.$or = [
        { name: { $regex: new RegExp(searchString, "i") } },
        { shortName: { $regex: new RegExp(searchString, "i") } },
        { $text: { $search: escaped, $caseSensitive: false } },
      ];
      delete filter.q;
    }
    let { limit } = aqp(query);
    limit = setLimit(limit);
    if (!filter.deleted) filter.deleted = 0;

    const total = await Subscribers.countDocuments(filter).exec();

    const result = await Subscribers.find(filter)
      .populate(population)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select(projection)
      .exec();

    if (!result) {
      throw new Error(`${module} record not found`);
    }
    const count = result.length;
    const msg = `${count} ${module} record(s) retrieved successfully!`;
    return { payload: result, total, count, msg, skip, limit, sort };
  } catch (err) {
    throw new Error(`Error retrieving ${module} record ${error.message}`);
  }
};

export const createService = async (data) => {
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`${error.message}`);

    const { subscriberEmail } = data;

    const existingRecord = await Subscribers.findOne({
      subscriberEmail,
    }).exec();
    if (existingRecord)
      throw new Error(`Subscriber already exist with that email`);

    data.code = await generateModelCode(Subscribers);

    const newRecord = new Subscribers(data);
    const result = await newRecord.save();
    if (!result) throw new Error(`${module} record not found`);

    return result;
  } catch (err) {
    throw new Error(`Error creating Subscribers record. ${err.message}`);
  }
};

export async function updateService(recordId, data, user) {
  try {
    const { error } = validateUpdate.validate(data);
    if (error) {
      throw new Error(`Invalid request. ${error.message}`);
    }

    const returnedSubscribers = await Subscribers.findById(recordId).exec();
    if (!returnedSubscribers)
      throw new Error(`${module} subscriber not found.`);
    if (user.userType !== "ADMIN" || "EDITOR") {
      throw new Error(
        `user ${user.email} does not have the permission to update`
      );
    }

    const result = await Subscribers.findOneAndUpdate({ _id: recordId }, data, {
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
    const result = await Subscribers.findOneAndRemove({ _id: recordId });
    if (!result) {
      throw new Error(`Subscribers record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting Subscribers record. ${err.message}`);
  }
}