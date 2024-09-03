export const user_register_rule = {
  address: [
    {
      required: true,
      message: "The address must not be empty",
      trigger: "blur",
    },
  ],

  patient_name: [
    {
      required: true,
      message: "Patient name must not be empty",
      trigger: "blur",
    },
    {
      min: 2,
      max: 10,
      message: "Patient name should be 2-10 digits",
      trigger: "blur",
    },
  ],

  doc_name: [
    {
      required: true,
      message: "Doctor's name must not be blank",
      trigger: "blur",
    },
    {
      min: 2,
      max: 10,
      message: "Doctor's name is 2-10 digits",
      trigger: "blur",
    },
  ],
  //doctor
  avatar: [
    {
      required: true,
      message: "The doctor's avatar must not be empty",
      trigger: "blur",
    },
    { min: 1, message: "formatting error", trigger: "blur" },
  ],
  //doctor
  description: [
    {
      required: true,
      message: "The personal profile must not be empty",
      trigger: "blur",
    },
  ],
  //Patients, Doctors, Administrators
  email: [
    { required: true, message: "Email must not be empty", trigger: "blur" },
    {
      type: "email",
      message: "Please fill in the correct e-mail form",
      trigger: "blur",
    },
  ],
  //patient
  gender: [
    { required: true, message: "Gender must not be empty", trigger: "blur" },
  ],
  //surgeon
  title_id: [
    {
      required: true,
      message: "The title id must not be empty",
      trigger: "blur",
    },
    {
      type: "number",
      message: "Title id needs to be a number",
      trigger: "blur",
    },
    { min: 1, message: "Title id formatting error", trigger: "blur" },
  ],
  //doctor
  dept_id: [
    {
      required: true,
      message: "Department id must not be empty",
      trigger: "blur",
    },
    {
      type: "number",
      message: "Department id needs to be a number",
      trigger: "blur",
    },
    { min: 1, message: "Department id format error", trigger: "blur" },
  ],
  //Patients, Doctors, Administrators
  phone: [
    {
      required: true,
      message: "Phone number must not be empty",
      trigger: "blur",
    },
    { pattern: /^\d+$/, message: "Phone number must be numeric" },
  ],
  //patient
  age: [
    { required: true, message: "Age must not be blank", trigger: "blur" },
    { pattern: /^\d+$/, message: "Age needs to be a number", trigger: "blur" },
  ],
  //Patients, Doctors, Administrators
  password: [
    { required: true, message: "Password must not be empty", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "Password needs to be 6-20 digits/letters",
      trigger: "blur",
    },
  ],
};

export const user_login_rule = {
  id: [{ required: true, message: "Id must not be empty", trigger: "blur" }],
  password: [
    { required: true, message: "Password must not be empty", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "Password needs to be 6-12 digits/letters",
      trigger: "blur",
    },
  ],
};
