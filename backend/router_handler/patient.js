const { query } = require("../db");
const bcrypt = require("bcryptjs");
const { loginUser } = require("../utils/login");

/**
 * @api {post} /user/patient/register Patient Registration
 * @apiDescription Patient Registration
 * @apiName patient_register
 * @apiGroup Patient
 * @apiBody {string} patient_name Patient name (must be 2-10 characters)
 * @apiBody {string{6...20}} password Password, 6-20 digits
 * @apiBody {string} phone Phone number, must be in correct format
 * @apiBody {string} email Email, must comply with the email format
 * @apiBody {number=0,1} gender Gender, 1 - female; 0 - male
 * @apiBody {number{0-200}} age Age, 0-120 years
 * @apiBody {string} address address
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     patient_name:"Sabina",
 *     password:"password",
 *     phone:"19861376009",
 *     email:"1363867975@qq.com",
 *     gender:1,
 *     age:22,
 *     address:"1500 Shun Hua Road",
 * }
 * @apiSuccessExample {json} Return Content:
 * {
    "status": 0,
    "message": "Registration Success!",
 * }
 * @apiVersion 1.0.0
 */
exports.regPatient = async (req, res) => {
  let { patient_name, password, phone, email, gender, age, address } = req.body;

  let sql, result;

  try {
    //You can't have the same e-mail address and phone number.
    sql = "select * from patient where email=? or phone=?";
    result = await query(sql, email, phone);
    if (result.length > 0) {
      return res.cc("You are already registered, please Login");
    }
    //User password encryption
    password = bcrypt.hashSync(password, 10);
    //Insert user
    sql = "insert into patient set ?";
    const patientInfo = {
      patient_name,
      password,
      phone,
      email,
      gender,
      age,
      address,
    };
    result = await query(sql, patientInfo);
    if (result.affectedRows !== 1) return res.cc("Registration Failure");
    res.cc("Registration Success!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /user/patient/login Patient Login
 * @apiDescription Patient Login
 * @apiName Patient Login
 * @apiGroup Patient
 * @apiBody {string} account Correctly formatted cell phone number or email address
 * @apiBody {string{6...20}} password Password, 6-20 digits
 * @apiExample {js} Example Request:account
 * {
 *     account:"19861376009",
 *     password:"password",
 * }
 * @apiSuccessExample {json} Return Content:
 * 
{
    "status": 0,
    "message": "Login successful!",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRpZW50X2lkIjoxLCJwYXRpZW50X25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGFzc3dvcmQiOiIiLCJwaG9uZSI6IjE5ODYxMzc2MDA5IiwiZ2VuZGVyIjoxLCJhZ2UiOjIyLCJhZGRyZXNzIjoi6L2v5Lu25a2m6ZmiIiwiaWF0IjoxNjgwNDkyNjkwLCJleHAiOjE3MTIwMjg2OTB9.axWmz9A4msmugtkLVUP7jgKACUEDpJd-CIXK6oBB0lI"
}
   
 * @apiVersion 1.0.0
 */
exports.loginPatient = async (req, res) => {
  await loginUser(req, res, "patient");
};
