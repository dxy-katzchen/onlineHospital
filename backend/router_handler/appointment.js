const { query } = require("../db");
const moment = require("moment");
const { removeEmpty } = require("../utils/removeEmpty");
const { concatSqlStr } = require("../utils/concatSqlStr");
/**
 * @api {post} /appointment/add Patient Appointment
 * @apiDescription Patient Appointment with Doctor(patient)
 * @apiName addAppointment
 * @apiGroup appointment
 * @apiBody {number} doc_id Appointed doctor id
 * @apiBody {string} desc description of illness
 * @apiBody {number{0,1}} consult_type 0 - Chat Consultation,1 - Video Consultation
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     doc_id:6,
 *     desc:"The patient can't sleep at night. ",
 *     consult_type:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Reservation Success!",
    "appt_number": 3
}
 * @apiVersion 1.0.0
 */
exports.addAppointment = async (req, res) => {
  const { role } = req.auth;
  if (role !== 1) return res.cc("Authorization Error");
  const { patient_id, patient_name } = req.auth;
  const { doc_id, desc, consult_type } = req.body;
  let sql, result;
  try {
    sql = "select * from doctor where doc_id=?";
    result = await query(sql, doc_id);
    if (result.length !== 1) return res.cc("Doctor id error");
    const { doc_spare, dept_id, title_id, title_name, dept_name, doc_name } =
      result[0];
    if (doc_spare < 1) return res.cc("The doctor's number is full today.");

    sql = "update doctor set doc_spare=? where doc_id=?";
    result = await query(sql, doc_spare - 1, doc_id);
    if (result.affectedRows !== 1) return res.cc("Appointment Failure");

    sql = "select dept_spare from department where dept_id=?";
    result = await query(sql, dept_id);
    if (result.length !== 1) return res.cc("Section id error");
    const { dept_spare } = result[0];

    sql = "update department set dept_spare=? where dept_id=?";
    result = await query(sql, dept_spare - 1, dept_id);
    if (result.affectedRows !== 1) return res.cc("Appointment Failure");

    sql = "select fee from appointment_fee where title_id=?";
    result = await query(sql, title_id);
    if (result.length !== 1) return res.cc("Title id error");
    const { fee } = result[0];

    let time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let status = "awaiting consultation";

    const appointment = {
      doc_id,
      doc_name,
      patient_id,
      patient_name,
      dept_id,
      dept_name,
      time,
      title_id,
      title_name,
      fee,
      desc,
      consult_type,
      status,
    };

    sql = "insert into appointment set ?";
    result = await query(sql, appointment);
    if (result.affectedRows !== 1) return res.cc("Appointment Failure!");
    res.send({
      status: 0,
      message: "Appointment Success!",

      appt_number: result.insertId,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /appointment/get Get reservation information
 * @apiDescription Doctors or patients to get the appointment information related to themselves (doctor,patient)
 * @apiName getAppointment
 * @apiGroup appointment
 * @apiBody {number} appt_id Consult id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     appt_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get Success",
    "data": {
        "appt_id": 1,
        "doc_id": 6,
        "doc_name": "Tom",
        "patient_id": 1,
        "patient_name": "Jerry",
        "dept_id": 1,
        "dept_name": "psychiatry",
        "time": "2023-04-05 23:38:18",
        "title_name": "surgeon",
        "title_id": 1,
        "fee": 5,
        "desc": "The patient can't sleep at night. ",
        "consult_type": 0,
        "canceled": 0,
        "med_hist_id": null,
        "ps_id": null,
        "inquiry_id": null,
     
    }
}
 * @apiVersion 1.0.0
 */
exports.getAppointment = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  let user_id = role === 1 ? req.auth.patient_id : req.auth.doc_id;

  const { appt_id } = req.body;
  let sql = "select * from appointment where appt_id=? and ";
  let result;
  try {
    sql += role === 1 ? "patient_id=?" : "doc_id=?";
    result = await query(sql, appt_id, user_id);

    if (result.length !== 1) return res.cc("Failed to get ");
    res.send({
      status: 0,
      message: "Get Success ",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /appointment/getMyList Get Appointment List (Filter) 
 * @apiDescription Doctors or patients get a list of appointments related to them (doctor, patient) and filter them according to the query criteria. 
 * @apiName getMyAppointmentList
 * @apiGroup appointment
 * @apiBody {string} doc_name Doctor's name 
 * @apiBody {string} patient_name Patient's name 
 * @apiBody {string} dept_name department
 * @apiBody {string} status status
 * @apiBody {number} consult_type Type of consultation 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required,But it can be null
 *     doc_name:"Sabina",
 *     patient_name:"Sabina",
 *     dept_name:"psychiatry",
 *     status:"Finished",
 *     consult_type:0,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get Success",
    "data": [
        {
            "appt_id": 1,
            "doc_id": 6,
            "doc_name": "Sabina",
            "patient_id": 1,
            "patient_name": "Sabina",
            "dept_id": 1,
            "dept_name": "psychiatry",
            "time": "2023-04-05 23:38:18",
            "title_name": "surgeon",
            "title_id": 1,
            "fee": 5,
            "desc": "The patient can't sleep at night. ",
            "consult_type": 0,
            "canceled": 0,
            "med_hist_id": 3,
            "ps_id": 1,
          
            "status": "Finished"
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getMyAppointmentList = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  let { ...queryInfo } = req.body;
  let user_id = role === 1 ? req.auth.patient_id : req.auth.doc_id;

  let sql = "select * from appointment where ";
  let result;
  try {
    sql += role === 1 ? `patient_id = ${user_id}` : "doc_id = " + user_id;
    result = await query(sql);
    queryInfo = removeEmpty(queryInfo);
    if (JSON.stringify(queryInfo) !== "{}") {
      sql += " and";

      let attrArr = [
        "doc_name",
        "patient_name",
        "status",
        "dept_name",
        "consult_type",
      ];
      // dynamic splicing sql strings
      sql = await concatSqlStr(sql, attrArr, queryInfo);

      result = await query(sql);
    }

    res.send({
      status: 0,
      message: " Get Success ",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /appointment/changeStatus  Get Appointment Status 
 * @apiDescription  Modify Appointment Status (common)
 * @apiName changeStatus
 * @apiGroup appointment
 * @apiBody {number} appt_id  Consult id 
 * @apiBody {string} status  Appointment status 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required,But it can be null
 *     appt_id:1,
 *     status:'awaiting consultation',
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Updating the status of the visit record was successful",
}
 * @apiVersion 1.0.0
 */
exports.changeStatus = async (req, res) => {
  const { appt_id, status } = req.body;
  let sql, result;
  try {
    sql = "update appointment set status=? where appt_id=?";
    result = await query(sql, appt_id, status);

    if (result.affectedRows !== 1)
      return res.cc("Failed to update visit record status");
    res.cc("Update of visit record status successful!", 0);
  } catch (error) {
    res.cc(error);
  }
};
