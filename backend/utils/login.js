const { query } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");

const isEmail = (str) => {
  let string = str.replace(/\s|&nbsp;/g, ""); // Remove invalid characters entered by the user first
  let reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
  return reg.test(string);
};

const isPhone = (str) => {
  let string = str.replace(/\s|&nbsp;/g, ""); // Remove invalid characters entered by the user first
  let reg = /^(?:\+?64|0)(?:2\d{1}|[3-9]\d{1})(?:[- ]?\d{3,4}){2}$/;
  return reg.test(string);
};

exports.loginUser = async (req, res, role) => {
  const userInfo = req.body;
  let sql = "select * from ";
  if (role === "patient") sql += "patient where ";
  if (role === "doctor") sql += "doctor where ";
  if (role === "admin") sql += "admin where ";

  let result;
  let { password, account } = userInfo;
  try {
    //Type checking
    // the user may enter the account: 1 - cell phone number; 2 - email; 3 - invalid content, we need to judge
    if (isEmail(account)) {
      //Login using e-mail
      sql += "email=?";
    } else if (isPhone(account)) {
      //login using phone number
      sql += "phone=?";
    } else {
      res.cc(
        "Please enter your cell phone number or email address in the correct format"
      );
    }

    result = await query(sql, account);
    if (result.length !== 1) return res.cc("You are not registered");
    const compareResult = bcrypt.compareSync(password, result[0].password);
    if (!compareResult) return res.cc("incorrect password");
    const user = { ...result[0], password: "" };
    const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn: "365d" });

    res.send({
      status: 0,
      message: "Login Successful!",
      token: "Bearer " + tokenStr,
    });
  } catch (error) {
    res.cc(error);
  }
};
