import Attempt from "../attemptModel.js";

const createAttempt = async (data) => {
  return await Attempt.create(data);
};

const findAttemptById = async (id) => {
  return await Attempt.findById(id);
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

export {
  createAttempt,
  findAttemptById,
  updateAttemptById,
  updateManyAttempts,
};
