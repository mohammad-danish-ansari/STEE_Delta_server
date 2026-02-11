import User from "../userModel";

const create = async (data) => {
  return await User.create(data);
};

const findById = async (id) => {
  return await User.findById(id);
};

const findOneByCondition = async (conditions = {}, options = {}) => {
  return await User.findOne(conditions, options);
};

const findByIdAndUpdate = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

const findOneAndDelete = async (condition) => {
  return await User.findOneAndDelete(condition);
};

const find = async (conditions = {}) => {
  return await User.find(conditions);
};

export {
  create,
  findById,
  findOneByCondition,
  findByIdAndUpdate,
  findOneAndDelete,
  find,
};
