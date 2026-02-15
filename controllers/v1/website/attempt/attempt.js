import { createAttempt, findAttempt, findAttemptById, findAttemptByIdAndDelete, findOneAttemptByCondition, updateAttemptById, }
  from "../../../../model/repositories/attemptRepository.js";
import OPTIONS from "../../../../config/Options.js";
import MESSAGES from "../../../../model/helpers/messagehelper.js";
import { findQuestion } from "../../../../model/repositories/questionRepository.js";


//   Start Attempt

export const startAttempt = async (req, res) => {
  try {
    const userId = req.auth.id;

    const existingAttempt = await findOneAttemptByCondition({
      userId,
      status: { $in: ["IN_PROGRESS", "SUBMITTED"] },
    });

    if (existingAttempt) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        success: false,
        message: MESSAGES.apiErrorStrings.ALREADY_SUBMITTED("Assessment"),
      });
    }

    // const duration = 60 * 60; 
    const duration = 20;
    // const duration = 5 * 60;

    const attempt = await createAttempt({
      userId,
      duration,
      startTime: new Date(),
      status: OPTIONS.status.IN_PROGRESS,
    });

    return res.status(MESSAGES.rescode.HTTP_CREATE).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.CREATED("Assessment attempt"),
      data: {
        attemptId: attempt._id,
        startTime: attempt.startTime,
        duration: attempt.duration,
      },
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};



//   Get Remaining Timer

export const getRemainingTime = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await findAttemptById(attemptId);

    if (!attempt) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        success: false,
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Attempt"),
      });
    }

    const now = new Date();
    const elapsedSeconds = Math.floor(
      (now - attempt.startTime) / 1000
    );

    const remainingTime = attempt.duration - elapsedSeconds;

    if (remainingTime <= 0 &&
      attempt.status === OPTIONS.status.IN_PROGRESS) {

      await updateAttemptById(attemptId, {
        status: OPTIONS.status.EXPIRED,
      });
    }

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.FETCHED("Timer"),
      data: {
        remainingTime: remainingTime > 0 ? remainingTime : 0,
        status: attempt.status,
      },
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};


//   Submit Attempt

export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await findAttemptById(attemptId);

    if (!attempt) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        success: false,
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Attempt"),
      });
    }

    if (attempt.status !== OPTIONS.status.IN_PROGRESS) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        success: false,
        message: MESSAGES.apiErrorStrings.ALREADY_SUBMITTED("Attempt"),
      });
    }

    //  Get all questions
    const questions = await findQuestion();

    let score = 0;

    answers.forEach((ans) => {
      const question = questions.find(
        (q) => q._id.toString() === ans.questionId
      );

      if (question && question.correctAnswer === ans.selectedOption) {
        score++;
      }
    });

    await updateAttemptById(attemptId, {
      status: OPTIONS.status.SUBMITTED,
      submittedAt: new Date(),
      answers,
      score,
    });

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.SUBMITTED("Assessment"),
      data: {
        score,
        totalQuestions: questions.length,
      },
    });

  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

export const getAllAttemptResult = async (req, res) => {
  try {

    const attempts = await findAttempt({
      status: OPTIONS.status.SUBMITTED,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.FETCHED("Results"),
      data: attempts,
    });

  } catch (error) {
    console.error("result error", error);

    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};


// ================= DELETE ATTEMPT (ADMIN) =================

export const deleteAttemptByAdmin = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const deletedAttempt = await findAttemptByIdAndDelete(attemptId);

    if (!deletedAttempt) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        success: false,
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Attempt"),
      });
    }

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.DELETED("Attempt"),
    });

  } catch (error) {
    console.error("delete attempt error", error);

    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};
