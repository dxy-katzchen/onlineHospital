const { query } = require("../db");
const { v4: uuidv4 } = require("uuid");
/**
 * @api {post} /consultation/imgText/get Get a list of graphic consultations
 * @apiDescription Get a list of graphic inquiries based on appt_id
 * @apiName getImgTxtConsultation
 * @apiGroup Consultation
 * @apiBody {number} appt_id Consult id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     appt_id:1
 * }
 * @apiSuccessExample {json} Return Content:
 * {
 *    "status":0,
 *    "message":"Get Success!",
 *    "data":[
 *      {"appt_id":8,"time":"16:29:58","role":1,"userName":"Sabina","content":"22222"},
 *      {"appt_id":8,"time":"16:30:07","role":2,"userName":"Sabina","content":"11111"},
 *      {"appt_id":8,"time":"16:46:32","role":1,"userName":"Sabina","content":"22222222222222"},
 *      {"appt_id":8,"time":"17:09:37","role":2,"userName":"Sabina","content":"1111111"},
 *      {"appt_id":8,"time":"17:09:39","role":2,"userName":"Sabina","content":"1111"},
 *      {"appt_id":8,"time":"17:10:38","role":2,"userName":"Sabina","content":"22222222222222222222222222222222222222222222222222222222222222222222222222"}
]}
 * @apiVersion 1.0.0
 */
exports.getImgTxtConsultation = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  const { appt_id } = req.body;
  let sql, result;
  try {
    sql = "select * from img_text_consultation where appt_id=?";
    result = await query(sql, appt_id);
    res.send({
      status: 0,
      message: "Get Success!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /consultation/video/add Add Video Consultation
 * @apiDescription Add Video Consultation
 * @apiName addVideoConsultation
 * @apiGroup Consultation
 * @apiBody {number} appt_id Consult id
 * @apiBody {number} doc_id Doctor id
 * @apiBody {number} patient_id Patient id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     appt_id:1,
 *     doc_id:1,
 *     patient_id:1
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Create a successful video consultation"
}
 * @apiVersion 1.0.0
 */
exports.addVideoConsultation = async (req, res) => {
  const { role } = req.auth;
  if (role !== 1) return res.cc("Authorization Error");
  const { appt_id } = req.body;

  let sql, result;

  try {
    sql = "select * from appointment where appt_id=?";
    result = await query(sql, appt_id);
    const { doc_id, patient_id } = result[0];
    const uuid = uuidv4();
    sql =
      "insert into video_consultation (uuid, appt_id, doc_id, patient_id) values (?, ?, ?, ?)";
    result = await query(sql, uuid, appt_id, doc_id, patient_id);
    if (result.affectedRows !== 1)
      return res.cc("Failed to create a video inquiry");

    res.send({
      status: 0,
      message: "Create a successful video consultation",
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /consultation/video/get Get Video Consultation
 * @apiDescription Retrieve Video Consultation details
 * @apiName getVideoConsultation
 * @apiGroup Consultation
 * @apiBody {number} appt_id Appointment id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //Required
 *     appt_id: 19
 * }
 * @apiSuccessExample {json} Return Content:
 * {
 *  "status": 0,
 *  "message": "Get Success!",
 *  "data": {
 *      "video_id": 2,
 *      "appt_id": "19",
 *      "patient_id": 5,
 *      "doc_id": 9,
 *      "uuid": "7c16c480-257c-4d1a-83d0-7b8d5ab35553"
 *  }
 * }
 * @apiVersion 1.0.0
 */

exports.getVideoConsultation = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  const { appt_id } = req.body;

  let sql, result;

  try {
    sql = "select * from video_consultation where appt_id=?";
    result = await query(sql, appt_id);
    if (result.length === 0) return res.cc("No video consultation found");
    res.send({
      status: 0,
      message: "Get Success!",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};
