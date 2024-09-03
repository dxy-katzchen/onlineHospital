const { query } = require("../db");
/**
 * @api {post} /department/add add department
 * @apiDescription add department(Admin)
 * @apiName department_add
 * @apiGroup Department
 * @apiBody {string} dept_name Department Name
 * @apiBody {string} dept_desc Department Profile
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     dept_name:"cardiovascular medicine",
 *     dept_desc:"Circulation.It is also the best developed area for interventional procedures, with coronary stents, radiofrequency ablation, pacemakers, congenital heart disease, etc.”
 * }
 * @apiSuccessExample {json} Return Content:
 * {
    "status": 0,
    "message": "Add Section Succeeded!",
 * }
 * @apiVersion 1.0.0
 */
exports.addDept = async (req, res) => {
  let { role } = req.auth;
  if (role !== 3)
    return res.cc(
      "You are not an Administrator and do not have permission to call this interface."
    );

  const deptInfo = req.body;
  deptInfo.dept_spare = 0;
  deptInfo.doc_number = 0;
  let sql, result;
  try {
    sql = "select * from department where dept_name=?";
    result = await query(sql, deptInfo.dept_name);
    if (result.length === 1) return res.cc("Duplicate department names!");
    sql = "insert into department set ?";
    result = await query(sql, deptInfo);
    if (result.affectedRows !== 1) return res.cc("Add Failed");

    res.cc("Add Department Success!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /department/getDeptList Get Department List
 * @apiDescription Get Department List (common)
 * @apiName getDeptList
 * @apiGroup Department
 * @apiBody {number} pageCurr Current page count
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     pageCurr:2
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get Department List Success!",
    "total":13,
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
exports.getDeptList = async (req, res) => {
  const { pageCurr } = req.body;
  const start = (pageCurr - 1) * 10; //starting position
  try {
    let sql = "select * from department limit ?,10";
    let result = await query(sql, start);
    sql = "select count(*) as total from department";
    let res1 = await query(sql);
    let { total } = res1[0];
    res.send({
      status: 0,
      message: "Get Department List Success!",
      result,
      total,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /department/getDoctorList Get a list of doctors
 * @apiDescription Get a list of doctors based on Departmentid (common)
 * @apiName getDoctorList
 * @apiGroup Department
 * @apiBody {number} dept_id Departmentid
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     dept_id:1
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get Doctor List Success!",
    "result": [
        {
            "doc_id": 6,
            "avatar": "https://dxy-img-set-1305336769.cos.ap-beijing.myqcloud.com/20221206102954.png",
            "password": "$2a$10$SHBDFndZHaErTW2PWnSsW.skhgrQxUNVH8aQQPsYJsTKJe6g.WANK",
            "title_id": 1,
            "dept_id": 1,
            "doc_name": "Sabina",
            "email": "1363867975@qq.com",
            "phone": "19861376009",
            "description": "Specializing in psychiatric disorders, depression, mania, schizophrenia, etc.",
            "doc_spare": 15,
            "title_name": "surgeon",
            "dept_name": "psychiatry"
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getDoctorList = async (req, res) => {
  const { dept_id } = req.body;
  try {
    let sql = "select * from doctor where dept_id=?";
    let result = await query(sql, dept_id);
    res.send({
      status: 0,
      message: "Get Doctor List Success!",
      result,
    });
  } catch (error) {
    res.cc(error);
  }
};
