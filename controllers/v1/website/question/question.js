import MESSAGES from "../../../../model/helpers/messagehelper.js";
import {
  createQuestion,
  findByIdAndDeleteQuestion,
  findByIdAndUpdateQuestion,
  findQuestion,
} from "../../../../model/repositories/questionRepository.js";

// ================= CREATE QUESTION (ADMIN) =================
export const createAdminQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    if (!question || !options || !correctAnswer) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.INVALID_REQUEST,
      });
    }

    if (options.length !== 4) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: "Question must have exactly 4 options",
      });
    }

    const newQuestion = await createQuestion({
      question,
      options,
      correctAnswer,
      createdBy: req.auth.id,
    });

    return res.status(MESSAGES.rescode.HTTP_CREATE).json({
      message: MESSAGES.apiSuccessStrings.CREATED("Question"),
      data: newQuestion,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

// ================= GET ALL QUESTIONS (ADMIN) =================
export const getAllAdminQuestions = async (req, res) => {
  try {
    const questions = await findQuestion();

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.FETCHED("Questions"),
      data: questions,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

// ================= GET QUESTIONS (CANDIDATE) =================
export const getCandidateQuestions = async (req, res) => {
  try {
    const questions = await findQuestion({}, { correctAnswer: 0 });

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.FETCHED("Questions"),
      data: questions,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

// ================= UPDATE QUESTION =================
export const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const updated = await findByIdAndUpdateQuestion(questionId, req.body);

    if (!updated) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Question"),
      });
    }

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.UPDATED("Question"),
      data: updated,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

// ================= DELETE QUESTION =================
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const deleted = await findByIdAndDeleteQuestion(questionId);

    if (!deleted) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Question"),
      });
    }

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.DELETED("Question"),
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};
