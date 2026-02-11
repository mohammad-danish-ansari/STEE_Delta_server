

const OPTIONS = {
 status: {
    IN_PROGRESS: "in-progress",
    SUBMITTED: "submitted",
    EXPIRED: "expired",

    getAllStatus: () => {
      return [
        ATTEMPT_OPTIONS.status.IN_PROGRESS,
        ATTEMPT_OPTIONS.status.SUBMITTED,
        ATTEMPT_OPTIONS.status.EXPIRED,
      ];
    },
  },
 role: {
    ADMIN: "ADMIN",
    CANDIDATE: "CANDIDATE",
    SUPER_ADMIN: "SUPER_ADMIN",

    getAllStatus: () => {
      return [
        OPTIONS.role.ADMIN,
        OPTIONS.role.CANDIDATE,
        OPTIONS.role.SUPER_ADMIN,
      ];
    },
  },

};
export default OPTIONS;
