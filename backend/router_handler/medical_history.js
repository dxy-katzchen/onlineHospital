const { query } = require("../db");
const moment = require("moment");
/**
 * @api {post} /medicalHistory/add Adding medical records to patients
 * @apiDescription Adding medical records to patients(doctor)
 * @apiName addMedicalHistory
 * @apiGroup medical_history
 * @apiBody {number} appt_id Appoinement id
 * @apiBody {string} description description of illness
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     appt_id:1,
 *     description:"The patient can't sleep at night."
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Add Medical Record Successfully!"
}
 * @apiVersion 1.0.0
 */
exports.addMedicalHistory = async (req, res) => {
  const { role } = req.auth;
  const { appt_id, description } = req.body;
  if (role !== 2) return res.cc("Authorization Error");

  let sql, result;
  try {
    sql = "select * from appointment where appt_id=?";
    result = await query(sql, appt_id);
    if (result.length !== 1) return res.cc("Inquiry Failure");
    const { doc_id, patient_id } = result[0];
    const time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const medical_history = {
      doc_id,
      patient_id,
      time,
      appt_id,
      description,
    };

    sql = "insert into medical_history set ?";
    result = await query(sql, medical_history);
    if (result.affectedRows !== 1)
      return res.cc("Failure to add medical records");
    const med_hist_id = result.insertId;

    sql = "update appointment set med_hist_id=? where appt_id=?";
    result = await query(sql, med_hist_id, appt_id);
    if (result.affectedRows !== 1)
      return res.cc("Failure to add medical records");

    res.cc("Add Medical Record Successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /medicalHistory/getMyList Patient/doctor access to their own list of medical records
 * @apiDescription Patient/doctor access to their own list of medical records(patient,doctor)
 * @apiName getMyMedicalHistoryList
 * @apiGroup medical_history
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    message: "Getting Medical Records Success!",
    "data": [
        {
            "med_hist_id": 1,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 2,
            "time": "2023-04-09 11:00:35",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        },
        {
            "med_hist_id": 3,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 1,
            "time": "2023-04-09 11:09:09",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        },
        {
            "med_hist_id": 4,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 3,
            "time": "2023-04-09 11:09:34",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        },
        {
            "med_hist_id": 5,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 5,
            "time": "2023-04-09 11:39:47",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        },
        {
            "med_hist_id": 7,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 4,
            "time": "2023-04-09 11:41:59",
            "description": "Patient with chest tightness and shortness of breath, palpitations",
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getMyMedicalHistoryList = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  let sql, result, uid;

  try {
    uid = role === 1 ? req.auth.patient_id : req.auth.doc_id;
    sql =
      role == 1
        ? "select * from medical_history where patient_id=?"
        : "select * from medical_history where doc_id=?";
    result = await query(sql, uid);
    res.send({
      status: 0,
      message: "Access to medical records successful!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /medicalHistory/getById Get medical records based on med_hist_id
 * @apiDescription Get a single medical record based on med_hist_id(doctor,patient)
 * @apiName getMedicalHistoryListById
 * @apiGroup medical_history
 * @apiBody {number} med_hist_id Medical record id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     med_hist_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    message: "Access to medical records successful!",
    "data": [
        {
            "med_hist_id": 1,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 2,
            "time": "2023-04-09 11:00:35",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getMedicalHistory = async (req, res) => {
  const { role } = req.auth;

  if (role === 3) return res.cc("Authorization Error");
  const { med_hist_id } = req.body;
  let sql, result;

  try {
    sql = "select * from medical_history where med_hist_id=?";
    result = await query(sql, med_hist_id);
    if (result.length !== 1) {
      return res.cc("Medical records do not exist for this id");
    }
    res.send({
      status: 0,
      message: "Getting Medical Records Success!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /medicalHistory/get Doctors get medical records based on patient id
 * @apiDescription Get medical records based on patient id(doctor)
 * @apiName getPatientMedicalHistory
 * @apiGroup medical_history
 * @apiBody {number} patient_id Patient id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     patient_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get patient medical record successfully!",
    "data": [
        {
            "med_hist_id": 1,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 2,
            "time": "2023-04-09 11:00:35",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        },
        {
            "med_hist_id": 3,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 1,
            "time": "2023-04-09 11:09:09",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        },
        {
            "med_hist_id": 4,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 3,
            "time": "2023-04-09 11:09:34",
            "description": "Patient with chest tightness and shortness of breath, palpitations",
        },
        {
            "med_hist_id": 5,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 5,
            "time": "2023-04-09 11:39:47",
            "description": "Patient with chest tightness and shortness of breath, palpitations",
        },
        {
            "med_hist_id": 7,
            "patient_id": 1,
            "doc_id": 6,
            "appt_id": 4,
            "time": "2023-04-09 11:41:59",
            "description": "Patient with chest tightness and shortness of breath, palpitations",

        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getPatientMedicalHistory = async (req, res) => {
  const { patient_id } = req.body;
  let sql, result;

  try {
    sql = "select * from medical_history where patient_id=?";
    result = await query(sql, patient_id);
    res.send({
      status: 0,
      message: "Get patient medical record successfully!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
