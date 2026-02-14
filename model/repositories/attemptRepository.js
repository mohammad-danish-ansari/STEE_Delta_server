import Attempt from "../attemptModel.js";

const createAttempt = async (data) => {
  return await Attempt.create(data);
};

const findAttemptById = async (id) => {
  return await Attempt.findById(id);
};

const findAttempt = (conditions = {}) => {
  return Attempt.find(conditions);
};
const findOneAttemptByCondition = async (conditions = {}, options = {}) => {
  return await Attempt.findOne(conditions, options);
};
const updateAttemptById = async (id, data) => {
  return await Attempt.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
};

const updateManyAttempts = async (condition, updateObj) => {
  return await Attempt.updateMany(condition, updateObj);
};
const findAttemptByIdAndDelete = async (condition) => {
  return await Attempt.findOneAndDelete(condition);
};
export {
  createAttempt,
  findAttemptById,
  findAttempt,
  findOneAttemptByCondition,
  updateAttemptById,
  updateManyAttempts,
  findAttemptByIdAndDelete
};
