const { query } = require("../db");
const bcrypt = require("bcryptjs");

const { loginUser } = require("../utils/login");

/**
 * @api {post} /user/admin/register Administrator Registration
 * @apiDescription Administrator Registration
 * @apiName admin_register
 * @apiGroup Admin
 * @apiBody {string} email Email, must comply with the Email format
 * @apiBody {string} phone Phone number
 * @apiBody {string{6...20}} password Password, 6-20 digits
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     password:"password",
 *     email:"1363867975@qq.com",
 *     phone:"19861376009"
 * }
 * @apiSuccessExample {json} Return Content:
 * {
    "status": 0,
    "message": "Registration Success!",
 * }
 * @apiVersion 1.0.0
 */
exports.regAdmin = async (req, res) => {
  let { password, phone, email } = req.body;

  let sql, result;

  try {
    sql = "select * from admin where email=? or phone=?";
    result = await query(sql, email, phone);
    if (result.length > 0) {
      return res.cc("You are already registered, please login");
    }
    password = bcrypt.hashSync(password, 10);

    sql = "insert into admin set ?";
    let adminInfo = { password, phone, email };
    result = await query(sql, adminInfo);
    if (result.affectedRows !== 1) return res.cc("Registration Failed");

    res.cc("Registration Success!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
       * @api {post} /user/admin/login Administrator Login
       * @apiDescription Administrator Login
       * @apiName Administrator Login
       * @apiGroup Admin
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
          "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwiZGVzY3JpcHRpb24iOiLkuJPmlLvnsr7npZ7nsbvnlr7nl4Us5oqR6YOB55eHLOeLgui6geeXhyznsr7npZ7liIboo4Lnl4fnrYkiLCJkb2Nfc3BhcmUiOjE1LCJ0aXRsZV9uYW1lIjoi5Yy75biIIiwiZGVwdF9uYW1lIjoi57K-56We56eRIiwiaWF0IjoxNjgwNjY3NTE0LCJleHAiOjE3MTIyMDM1MTR9.Q19cV5yL9uxuh9b23-kF-hV7-VsI21jTuebDDSvXD20"
      }
         
       * @apiVersion 1.0.0
       */
exports.loginAdmin = async (req, res) => {
  await loginUser(req, res, "admin");
};
