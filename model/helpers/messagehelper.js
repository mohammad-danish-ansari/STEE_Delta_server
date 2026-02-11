const MESSAGES = {
  rescode: {
    HTTP_OK: 200,
    HTTP_CREATE: 201,
    HTTP_NO_CONTENT: 204,
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_FORBIDDEN: 403,
    HTTP_NOT_FOUND: 404,
    HTTP_CONFLICT: 409,
    HTTP_INTERNAL_SERVER_ERROR: 500,
  },

  errorTypes: {
    ENTITY_NOT_FOUND: "EntityNotFound",
    INVALID_REQUEST: "InvalidRequest",
    ALREADY_EXISTS: "AlreadyExists",
    ALREADY_SUBMITTED: "AlreadySubmitted",
    UNAUTHORIZED: "Unauthorized",
    INTERNAL_SERVER_ERROR: "InternalServerError",
  },

  apiErrorStrings: {
    INVALID_REQUEST: "Invalid request data",
    SERVER_ERROR: "Something went wrong",

    DATA_EXISTS: (data) => `${data} already exists`,
    DATA_NOT_EXISTS: (data) => `${data} does not exists`,
    DATA_NOT_FOUND: (data) => `${data} not found`,
    INVALID_CREDENTIALS: "Invalid credentials",
    INVALID_OTP: "Invalid OTP",
    OTP_EXPIRED: "OTP expired",
    UNAUTHORIZED: "You are not authorized",
    INVALID_TOKEN: "Invalid or expired token",
    INVALID_STATUS: (data) => `Invalid ${data} status`,
  },

  apiSuccessStrings: {
    ADDED: (data) => `${data} added successfully`,
    CREATED: (data) => `${data} created successfully`,
    UPDATED: (data) => `${data} updated successfully`,
    DELETED: (data) => `${data} deleted successfully`,
    FETCHED: (data) => `${data} fetched successfully`,
    SUBMITTED: (data) => `${data} submitted successfully`,

    LOGIN_SUCCESS: "Login successful",
    OTP_SENT: "OTP sent successfully",
    OTP_VERIFIED: "OTP verified successfully",
    CANDIDATE_CREATED: "Candidate created successfully",
  },
};

export default MESSAGES;
