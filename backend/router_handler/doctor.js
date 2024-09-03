const { query } = require("../db");
const bcrypt = require("bcryptjs");

const { loginUser } = require("../utils/login");

/**
 * @api {post} /user/doctor/register Doctor Registration
 * @apiDescription Doctor Registration
 * @apiName doctor_register
 * @apiGroup Doctor
 * @apiBody {string} doc_name Doctor's name (must be 2-10 characters)
 * @apiBody {string{6...20}} password Password, 6-20 digits
 * @apiBody {string} email Email, must comply with the Email format
 * @apiBody {string} phone phone number
 * @apiBody {number} title_id Title id, 1 - Consultant; 2 - Fellow; 3 - Resident; 4 - Attending Physician
 * @apiBody {number} dept_id Departmentid
 * @apiBody {string} avatar Avatar address
 * @apiBody {string} description personal profile
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     doc_name:"Sabina",
 *     password:"password",
 *     email:"1363867975@qq.com",
 *     phone:"19861376009"
 *     title_id:1,
 *     dept_id:1,
 *     avatar:"https://dxy-img-set-1305336769.cos.ap-beijing.myqcloud.com/20221206102954.png"
 *     description:"Specializing in psychiatric disorders, depression, mania, schizophrenia, etc.",
 * }
 * @apiSuccessExample {json} Return Content:
 * {
    "status": 0,
    "message": "Registration Success!",
 * }
 * @apiVersion 1.0.0
 */
exports.regDoctor = async (req, res) => {
  let {
    doc_name,
    password,
    phone,
    email,
    title_id,
    dept_id,
    avatar,
    description,
  } = req.body;

  let sql, result;

  try {
    sql = "select * from doctor where email=? or phone=?";
    result = await query(sql, email, phone);
    if (result.length > 0) {
      return res.cc("You are already registered, please Login");
    }
    password = bcrypt.hashSync(password, 10);

    sql = "select title_name from appointment_fee where title_id=?";
    result = await query(sql, title_id);
    if (result.length !== 1) return res.cc("Registration Failure");
    let title_name = result[0].title_name;

    sql = "select * from department where dept_id=?";
    result = await query(sql, dept_id);
    if (result.length !== 1) return res.cc("Registration Failure");
    let dept_name = result[0].dept_name;
    let { doc_number, dept_spare } = result[0];

    //更新Department(department)表
    sql = "update department set doc_number=?,dept_spare=? where dept_id=?";
    result = await query(sql, doc_number + 1, dept_spare + 15, dept_id);
    if (result.affectedRows !== 1) return res.cc("Registration Failure");

    sql = "insert into doctor set ?";
    let doctorInfo = {
      doc_name,
      password,
      phone,
      email,
      title_id,
      title_name,
      dept_id,
      dept_name,
      avatar,
      description,
    };
    result = await query(sql, doctorInfo);
    if (result.affectedRows !== 1) return res.cc("Registration Failure");

    res.cc("Registration Success!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /user/doctor/login Doctor Login
 * @apiDescription Doctor Login
 * @apiName Doctor Login
 * @apiGroup Doctor
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
    "message": "Login Successful!",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwiZGVzY3JpcHRpb24iOiLkuJPmlLvnsr7npZ7nsbvnlr7nl4Us5oqR6YOB55eHLOeLgui6geeXhyznsr7npZ7liIboo4Lnl4fnrYkiLCJkb2Nfc3BhcmUiOjE1LCJ0aXRsZV9uYW1lIjoi5Yy75biIIiwiZGVwdF9uYW1lIjoi57K-56We56eRIiwiaWF0IjoxNjgwNjY3NTE0LCJleHAiOjE3MTIyMDM1MTR9.Q19cV5yL9uxuh9b23-kF-hV7-VsI21jTuebDDSvXD20"
}
   
 * @apiVersion 1.0.0
 */
exports.loginDoctor = async (req, res) => {
  await loginUser(req, res, "doctor");
};
/**
 * @api {post} /user/doctor/department/getAllDeptList Get Department list
 * @apiDescription Get Department List (common)
 * @apiName getAllDeptList
 * @apiGroup Doctor

 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }

 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get Department list successfully!",
    
    "result": [
        {
            "dept_id": 11,
            "dept_name": "endocrinology (medicine)",
            "dept_desc": "Endocrine, metabolic system. Abnormalities in various hormonal regulatory axes are the mainstay, with diabetes mellitus, osteoporosis, hyperthyroidism, pituitary disorders, and more common.",
            "dept_spare": 0,
            "doc_number": 0
        },
        {
            "dept_id": 12,
            "dept_name": "neurology",
            "dept_desc": "Diseases with definite organic neurological lesions. Cerebrovascular disease (e.g., ischemic stroke), epilepsy, movement disorders (Parkinson's, etc.), neuromuscular disorders, headache.",
            "dept_spare": 0,
            "doc_number": 0
        },
        {
            "dept_id": 13,
            "dept_name": "otolaryngology",
            "dept_desc": "Smaller hospitals incorporate the oral cavity as well and call it the Pentacenter. In addition to the management of ear, nose and throat, but also the head and neck of the other departments not covered by the content",
            "dept_spare": 0,
            "doc_number": 0
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getAllDeptList = async (req, res) => {
  try {
    let sql = "select * from department ";
    let result = await query(sql);

    res.send({
      status: 0,
      message: "Get Department list successfully!",
      result,
    });
  } catch (error) {
    res.cc(error);
  }
};
