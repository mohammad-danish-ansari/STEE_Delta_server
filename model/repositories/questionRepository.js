import Question from "../questionModel.js";

const createQuestion = async (data) => {
  return await Question.create(data);
};

const findQuestion = async (conditions = {}, options = {}) => {
  return await Question.find(conditions, options);
};

const findQuestionById = async (id) => {
  return await Question.findById(id);
};

const findByIdAndUpdateQuestion = async (id, data) => {
  return await Question.findByIdAndUpdate(id, data, { new: true });
};

const findByIdAndDeleteQuestion = async (id) => {
  return await Question.findByIdAndDelete(id);
};

export {
  createQuestion,
  findQuestion,
  findQuestionById,
  findByIdAndUpdateQuestion,
  findByIdAndDeleteQuestion,
};
