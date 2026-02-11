import { createAttempt, findAttemptById, updateAttemptById } 
from "../../../../model/repositories/attemptRepository.js";
import OPTIONS from "../../../../config/Options.js";
import MESSAGES from "../../../../model/helpers/messagehelper.js";


//   Start Attempt

export const startAttempt = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        success: false,
        message: MESSAGES.apiErrorStrings.INVALID_REQUEST,
      });
    }

    const duration = 60 * 60;

    const attempt = await createAttempt({
      userId,
      duration,
      startTime: new Date(),
      status: OPTIONS.status.IN_PROGRESS,
    });

    return res.status(MESSAGES.rescode.HTTP_CREATE).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.CREATED("Attempt"),
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

    await updateAttemptById(attemptId, {
      status: OPTIONS.status.SUBMITTED,
      submittedAt: new Date(),
    });

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.SUBMITTED("Attempt"),
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};
