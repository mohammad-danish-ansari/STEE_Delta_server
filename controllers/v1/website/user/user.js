import { ADMIN_USER } from "../../../../config/config.js";
import {
  findOneByCondition,
  create as createUser,
  findByIdAndUpdate,
} from "../../../../model/repositories/userRepository.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import MESSAGES from "../../../../model/helpers/messagehelper.js";
import OPTIONS from "../../../../config/Options.js";
import emailotp from "../../../../model/helpers/email.js";

export const superAdminInsertFun = async () => {
  try {
    const existsUser = await findOneByCondition(
      { email: ADMIN_USER.email },
      { _id: 1 }
    );

    if (!existsUser) {
      const hashedPassword = await bcrypt.hash(
        ADMIN_USER.password,
        10
      );

      await create({
        ...ADMIN_USER,
        password: hashedPassword,
      });

      console.log("Admin created successfully");
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

    const user = await userAuth.findOne({
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
    // Role Check
    if (
      req.user.role !== OPTIONS.role.ADMIN &&
      req.user.role !== OPTIONS.role.SUPER_ADMIN
    ) {
      return res.status(403).json({
        message: "You are not authorized to create candidate",
      });
    }

    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: OPTIONS.role.CANDIDATE, 
    });

   return res.status(MESSAGES.rescode.HTTP_CREATE).json({
  message: MESSAGES.apiSuccessStrings.ADDED("Candidate"),
  data:newUser
});
  } catch (error) {
    return res
      .status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR)
      .json({
        message: MESSAGES.apiErrorStrings.SERVER_ERROR,
        error: error.message,
      });
  }
};


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
    const otpExpire = Date.now() + 10 * 60 * 1000;

    await findByIdAndUpdate(user._id, { otp, otpExpire });

    await emailotp({ user: email, otp });

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.OTP_SENT,
    });
  } catch (error) {
    return res
      .status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR)
      .json({
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

    await findByIdAndUpdate(user._id, {
      otp: null,
      otpExpire: null,
    });

   const token = user.genToken();

    return res.status(MESSAGES.rescode.HTTP_OK).json({
      message: MESSAGES.apiSuccessStrings.LOGIN_SUCCESS,
      token,
    });
  } catch (error) {
    return res
      .status(MESSAGES.rescode.HTTP_INTERNAL_SERVER_ERROR)
      .json({
        message: MESSAGES.apiErrorStrings.SERVER_ERROR,
      });
  }
};
