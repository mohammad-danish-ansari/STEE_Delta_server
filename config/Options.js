

const OPTIONS = {
 status: {
    IN_PROGRESS: "in-progress",
    SUBMITTED: "submitted",
    EXPIRED: "expired",

    getAllStatus: () => {
      return [
        OPTIONS.status.IN_PROGRESS,
        OPTIONS.status.SUBMITTED,
        OPTIONS.status.EXPIRED,
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
