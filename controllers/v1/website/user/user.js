import { ADMIN_USER } from "../../../../config/config.js";
import {
  findOneByCondition,
  create as createUser,
  findByIdAndUpdate,
  find,
  findById,
  create,
  findOneAndDelete,
} from "../../../../model/repositories/userRepository.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import MESSAGES from "../../../../model/helpers/messagehelper.js";
import OPTIONS from "../../../../config/Options.js";
import { emailotp } from "../../../../model/helpers/email.js";
import { findOneAttemptByCondition } from "../../../../model/repositories/attemptRepository.js";
import { sendAssessmentInviteEmail } from './../../../../model/helpers/sendAssessmentInviteEmail.js';



// =================== Admin =======================
export const superAdminInsertFun = async () => {
  try {
    const existsUser = await findOneByCondition(
      { email: ADMIN_USER.email },
      { _id: 1 },
    );

    if (!existsUser) {
      const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);

      await create({
        ...ADMIN_USER,
        password: hashedPassword,
      });

    }
  } catch (error) {
    console.error("User Not Created", error);
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.INVALID_REQUEST,
      });
    }

    const user = await findOneByCondition({
      email: email.toLowerCase(),
      role: "ADMIN",
    });

    if (!user) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        message: MESSAGES.apiErrorStrings.DATA_NOT_EXISTS("Admin"),
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(MESSAGES.rescode.HTTP_UNAUTHORIZED).json({
        message: MESSAGES.apiErrorStrings.INVALID_CREDENTIALS,
      });
    }

    const token = user.genToken();

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.LOGIN_SUCCESS,
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

export const createCandidate = async (req, res) => {
  try {

    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.INVALID_REQUEST,
      });
    }

    const existingUser = await findOneByCondition({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.DATA_EXISTS("Candidate"),
      });
    }


    const newUser = await createUser({
      name,
      phone,
      email: email.toLowerCase(),
      role: OPTIONS.role.CANDIDATE,
    });

     await sendAssessmentInviteEmail({
      name,
      email,
    });

    return res.status(MESSAGES.rescode.HTTP_CREATE).json({
      message: "Candidate added successfully & assessment link sent",
      data: newUser,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
      error: error.message,
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const user = await findById(req.auth.id);

    if (!user) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Admin"),
      });
    }

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.FETCHED("Admin"),
      data: user,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

// export const getAllCandidates = async (req, res) => {
//   try {
//     const candidates = await find({ role: "CANDIDATE" });

//     return res.status(MESSAGES.rescode.HTTP_OK).json({
//       message: MESSAGES.apiSuccessStrings.FETCHED("candidates"),
//       data: candidates,
//     });
//   } catch (error) {
//     return res
//       .status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR)
//       .json({ message: MESSAGES.apiErrorStrings.SERVER_ERROR });
//   }
// };
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await find({ role: "CANDIDATE" });

    const candidatesWithStatus = await Promise.all(
      candidates.map(async (candidate) => {
        const attempt = await findOneAttemptByCondition({
          userId: candidate._id,
        });

        let status = "Pending";

        if (attempt) {
          status = attempt.status;
        }

        return {
          ...candidate.toObject(),
          status,
        };
      })
    );

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.FETCHED("candidates"),
      data: candidatesWithStatus,
    });
  } catch (error) {
    return res
      .status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.apiErrorStrings.SERVER_ERROR });
  }
};
export const updateUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId===", userId);
    const updateData = req.body;

    const userData = await findById(userId);
    console.log("userData===", userData);
  // await sendAssessmentInviteEmail({
  //    userData
  //   });
    if (!userData) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        success: false,
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Candidate"),
      });
    }

    const updatedUser = await findByIdAndUpdate(userId, updateData);
    
    return res.status(MESSAGES.rescode.HTTP_OK).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.UPDATED("Candidate"),
      data: updatedUser,
    });

  } catch (error) {
    console.error("update candidate error", error);
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};
export const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        success: false,
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Candidate"),
      });
    }

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      success: true,
      message: MESSAGES.apiSuccessStrings.DELETED("Candidate"),
    });

  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};



// =================== Candidate =======================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.INVALID_REQUEST,
      });
    }

    const user = await findOneByCondition({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Candidate"),
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = Date.now() + 2 * 60 * 1000

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    await emailotp({
      user: email,
      otp,
    });

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.OTP_SENT,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.INVALID_REQUEST,
      });
    }

    const user = await findOneByCondition({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("Candidate"),
      });
    }

    if (user.otp !== otp) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.INVALID_OTP,
      });
    }

    if (Date.now() > user.otpExpire) {
      return res.status(MESSAGES.rescode.HTTP_BAD_REQUEST).json({
        message: MESSAGES.apiErrorStrings.OTP_EXPIRED,
      });
    }
    const otpExpire = Date.now() + 2 * 60 * 1000;
    await findByIdAndUpdate(user._id, {
      otp: null,
      otpExpire: null,
    });

    const token = user.genToken();

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.LOGIN_SUCCESS,
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};



export const getCandidateProfile = async (req, res) => {
  try {
    const user = await findById(req.auth.id)

    if (!user) {
      return res.status(MESSAGES.rescode.HTTP_NOT_FOUND).json({
        message: MESSAGES.apiErrorStrings.DATA_NOT_FOUND("candidate"),
      });
    }

    const attempt = await findOneAttemptByCondition({
      userId: req.auth.id,
      status: "submitted",
    });

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.FETCHED("candidate"),
      data: {
        ...user.toObject(),
        hasAttempted: !!attempt,
      },
    });
  } catch (error) {
    return res.status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.apiErrorStrings.SERVER_ERROR,
    });
  }
};
