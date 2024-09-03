const { query } = require("../db");
/**
 * @api {post} /avatar/patient Patient updates/adds avatar
 * @apiDescription Visitors update/add avatars (for face recognition)
 * @apiName updatePatientAvatar
 * @apiGroup avatar
 * @apiBody {number} patient_id Patient id
 * @apiBody {string} avatar Avatar url
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     patient_id:1,
 *     avatar:"xxxxxx",
 * }
 * @apiSuccessExample {json} Return Content:
 * {
    "status": 0,
    "message": "Uploaded successfully!",
 * }
 * @apiVersion 1.0.0
 */
exports.updatePatientAvatar = async (req, res) => {
  const { role } = req.auth;

  if (role !== 1) return res.cc("Authorization Error");

  const { avatar, patient_id } = req.body;
  let sql, result;
  try {
    sql = "update patient set avatar=? where patient_id=?";
    result = await query(sql, avatar, patient_id);
    if (result.affectedRows !== 1) return res.cc("Upload Failed");
    res.cc("Uploaded successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /avatar/doctor Doctors update/add avatars
 * @apiDescription Doctors update/add avatars (for face recognition)
 * @apiName updateDoctorAvatar
 * @apiGroup avatar
 * @apiBody {number} doc_id Doctor id
 * @apiBody {string} avatar Avatar url
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     doc_id:1,
 *     avatar:"xxxxxx",
 * }
 * @apiSuccessExample {json} Return Content:
 * {
    "status": 0,
    "message": "Uploaded successfully!",
 * }
 * @apiVersion 1.0.0
 */
exports.updateDoctorAvatar = async (req, res) => {
  const { role } = req.auth;

  if (role !== 2) return res.cc("Authorization Error");

  const { avatar, doc_id } = req.body;
  let sql, result;
  try {
    sql = "update doctor set avatar=? where doc_id=?";
    result = await query(sql, avatar, doc_id);
    if (result.affectedRows !== 1) return res.cc("Upload Failed");
    res.cc("Uploaded successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
