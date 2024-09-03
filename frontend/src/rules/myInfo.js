export const change_myinfo_rule = {
  email: [
    { required: true, message: "Email must not be empty", trigger: "blur" },
    {
      type: "email",
      message: "Please fill in the correct e-mail form",
      trigger: "blur",
    },
  ],
  username: [
    { required: true, message: "User name must not be empty", trigger: "blur" },
    {
      min: 1,
      max: 12,
      message: "Username should be 1-12 digits",
      trigger: "blur",
    },
  ],
};
