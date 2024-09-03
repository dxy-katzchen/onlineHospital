const { query } = require("../db");
const moment = require("moment");
// const res = require("express/lib/response");
/**
 * @api {post} /prescription/create Create a prescription
 * @apiDescription Create a prescription(doctor)
 * @apiName createPrescription
 * @apiGroup Prescription
 * @apiBody {number} appt_id 挂号id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //required
 *     appt_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Add successfully",
    "ps_id":1
}
 * @apiVersion 1.0.0
 */
exports.createPrescription = async (req, res) => {
  const { role } = req.auth;
  if (role !== 2) return res.cc("Authorization Error");
  const { doc_id } = req.auth;
  const { appt_id } = req.body;

  let sql, result;
  try {
    sql = "select * from appointment where appt_id=?";
    result = await query(sql, appt_id);
    if (result[0].ps_id)
      return res.cc(
        `You have created a prescription, prescription number (ps_id) is ${result[0].ps_id}`
      );
    const { patient_id } = result[0];

    let create_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    const psInfo = {
      doc_id,
      patient_id,
      create_time,
    };
    sql = "insert into prescription set ?";
    result = await query(sql, psInfo);
    if (result.affectedRows !== 1)
      return res.cc("Failed to create prescription");
    let { insertId } = result;

    sql = "update appointment set ps_id=? where appt_id=?";
    result = await query(sql, insertId, appt_id);
    if (result.affectedRows !== 1)
      return res.cc("Failed to create prescription");

    res.send({
      status: 0,
      message: "Successful prescription creation",
      ps_id: insertId,
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /prescription/addDrugPs Adding prescription drugs
 * @apiDescription Adding prescription drugs(doctor)
 * @apiName addPrescriptionDrug
 * @apiGroup Prescription
 * @apiBody {number} ps_id Prescription id
 * @apiBody {number} drug_name drug name
 * @apiBody {number} quantity quantities
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     ps_id:1,
 *     drug_name:"ibuprofen",
 *     quantity:2,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Add successfully!"
}
 * @apiVersion 1.0.0
 */
exports.addDrugPrescription = async (req, res) => {
  const { role } = req.auth;
  if (role !== 2) return res.cc("Authorization Error");
  //1. Input ps_id, input drug name to search and get drug information.
  const { ps_id, drug_name, quantity } = req.body;
  //2. get receipt
  let sql, result;
  try {
    sql = "select * from drug where drug_name=?";
    result = await query(sql, drug_name);
    if (result.length !== 1) return res.cc("The drug is not available");
    const { single_price } = result[0];

    const ps_drug = {
      ps_id,
      drug_name,
      quantity,
      price: quantity * single_price,
    };
    //Check to see if prescription_drug had this record in the first place.
    sql = "select * from prescription_drug where ps_id=? and drug_name=?";
    result = await query(sql, ps_id, drug_name);
    if (result.length == 0) {
      //If not, add a record
      sql = "insert into prescription_drug set ?";
      result = await query(sql, ps_drug);
      if (result.affectedRows !== 1) return res.cc("添加失败");
    } else {
      //If so, just update it.
      sql = "update prescription_drug set ? where ps_id=? and drug_name=?";
      result = await query(sql, ps_drug, ps_id, drug_name);
      if (result.affectedRows !== 1) return res.cc("添加失败");
    }
    //3.Modify the total price in the PRESCRIPTION table
    await updateTotalPrice(ps_id);

    res.cc("Add successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /prescription/deleteDrugPs Deletion of prescription drugs
 * @apiDescription Deletion of prescription drugs (doctor)
 * @apiName deletePrescriptionDrug
 * @apiGroup Prescription
 * @apiBody {number} ps_id Prescription id
 * @apiBody {number} drug_name drug name
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     ps_id:1,
 *     drug_name:"ibuprofen",
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Remove drug ibuprofen successfully!"
}
 * @apiVersion 1.0.0
 */
exports.deleteDrugPrescription = async (req, res) => {
  const { role } = req.auth;
  if (role !== 2) return res.cc("Authorization Error");

  const { ps_id, drug_name } = req.body;
  let sql, result;
  try {
    sql = "delete from prescription_drug where ps_id=? and drug_name=?";
    result = await query(sql, ps_id, drug_name);

    if (result.affectedRows !== 1) return res.cc("Failed to delete");
    res.cc(`Delete drug ${drug_name} successfully!`, 0);
  } catch (error) {
    res.cc(error);
  }
};
//Update the total_price field of the prescription
const updateTotalPrice = async (ps_id) => {
  let sql, result;
  try {
    sql = "select price from prescription_drug where ps_id=?";
    result = await query(sql, ps_id);
    let sum = 0;
    result.forEach((e) => (sum += e.price), 0);
    sql = "update prescription set total_price=? where ps_id=?";
    result = await query(sql, sum, ps_id);
    if (result.affectedRows !== 1)
      return res.cc("Failed to update total_price of prescription");
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /prescription/detail Get prescription details
 * @apiDescription Get prescription details (patient, doctor), including drug details and total price. Patients can only access prescriptions that are relevant to them, doctors can access all prescriptions.
 * @apiName getPsDetail
 * @apiGroup Prescription
 * @apiBody {number} ps_id Prescription id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     ps_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get prescription successfully!",
    "generalInfo": {
        "ps_id": 1,
        "create_time": "2023-04-12 14:06:20",
        "total_price": 260,
        "patient_id": 1,
        "doc_id": 6
    },
    "drugList": [
        {
            "ps_id": 1,
            "drug_name": "sleeping pill",
            "quantity": 6,
            "price": 120
        },
        {
            "ps_id": 1,
            "drug_name": "ibuprofen",
            "quantity": 7,
            "price": 140
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getPsDetail = async (req, res) => {
  const { role } = req.auth;
  const { ps_id } = req.body;
  let sql, result;
  try {
    sql = "select * from prescription where ps_id=?";
    result = await query(sql, ps_id);
    if (result.length !== 1) return res.cc("No such prescription exists.");
    if (role == 1 && result[0].patient_id !== req.auth.patient_id)
      return res.cc(
        "You do not have access to other people's prescription orders"
      );
    let generalInfo = result[0];
    sql = "select * from prescription_drug where ps_id=?";
    let drugList = await query(sql, ps_id);
    res.send({
      status: 0,
      message: "Get prescription order successfully!",
      generalInfo,
      drugList,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /prescription/getPsId Get ps_id according to appt_id
 * @apiDescription Get ps_id according to appt_id(doctor,patient)
 * @apiName getPsId
 * @apiGroup Prescription
 * @apiBody {number} appt_id Appointment id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //Required
 *     appt_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get ps_id successfully",
    "ps_id":1
}
 * @apiVersion 1.0.0
 */
exports.getPsId = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  const { appt_id } = req.body;
  let sql, result;
  try {
    sql = "select * from appointment where appt_id=?";
    result = await query(sql, appt_id);
    if (result.length !== 1)
      return res.cc("This appointment id does not exist");
    if (result[0].ps_id === null) return res.cc("Prescription not created");
    const { ps_id } = result[0];
    res.send({
      status: 0,
      message: "Get ps_id Successfully",
      ps_id,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /prescription/getApptId Get appt_id according to ps_id
 * @apiDescription Get appt_id according to ps_id(doctor,patient)
 * @apiName getApptId
 * @apiGroup Prescription
 * @apiBody {number} ps_id prescription id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //Required
 *     ps_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "get appt_id successfully",
    "appt_id":1
}
 * @apiVersion 1.0.0
 */
exports.getApptId = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  const { ps_id } = req.body;
  let sql, result;
  try {
    sql = "select * from appointment where ps_id=?";
    result = await query(sql, ps_id);
    if (result.length !== 1) return res.cc("Record does not exist");
    const { appt_id } = result[0];
    res.send({
      status: 0,
      message: "Get appt_id successfully",
      appt_id,
    });
  } catch (error) {}
};
/**
 * @api {post} /prescription/pay Payment of prescription orders
 * @apiDescription Payment of prescription orders(patient)
 * @apiName payPs
 * @apiGroup Prescription
 * @apiBody {number} ps_id prescription id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //Required
 *     ps_id:1,
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Payment successful!"
}
 * @apiVersion 1.0.0
 */
exports.payPs = async (req, res) => {
  const { role } = req.auth;
  if (role !== 1) return res.cc("Authorization Error");
  const { ps_id } = req.body;
  let sql, result;
  try {
    sql = "update prescription set paid = 1 where ps_id=?";
    result = await query(sql, ps_id);
    if (result.affectedRows !== 1) {
      return res.cc("failed payment");
    }
    res.cc("Payment successful!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /prescription/getMyList Get a list of my prescription orders
 * @apiDescription Get a list of my prescription orders(patient,doctor)
 * @apiName getMyPsList
 * @apiGroup Prescription
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2NfaWQiOjYsImF2YXRhciI6Imh0dHBzOi8vZHh5LWltZy1zZXQtMTMwNTMzNjc2OS5jb3MuYXAtYmVpamluZy5teXFjbG91ZC5jb20vMjAyMjEyMDYxMDI5NTQucG5nIiwicGFzc3dvcmQiOiIiLCJ0aXRsZV9pZCI6MSwiZGVwdF9pZCI6MSwiZG9jX25hbWUiOiLkuIHlv4PlrpwiLCJlbWFpbCI6IjEzNjM4Njc5NzVAcXEuY29tIiwicGhvbmUiOiIxOTg2MTM3NjAwOSIsImRlc2NyaXB0aW9uIjoi5LiT5pS757K-56We57G755a-55eFLOaKkemDgeeXhyzni4LouoHnl4cs57K-56We5YiG6KOC55eH562JIiwiZG9jX3NwYXJlIjoxNSwidGl0bGVfbmFtZSI6IuWMu-W4iCIsImRlcHRfbmFtZSI6IueyvuelnuenkSIsImlhdCI6MTY4MDY4MjI4NywiZXhwIjoxNzEyMjE4Mjg3fQ.ApTVhub_vd226XOwKUlFQOjVHkd3WXjVJe7Ee8wZbzM"
 *     }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Get My Prescription List Success!"
}
 * @apiVersion 1.0.0
 */
exports.getMyPsList = async (req, res) => {
  const { role } = req.auth;
  if (role === 3) return res.cc("Authorization Error");
  try {
    let uid, sql, result;
    uid = role === 1 ? req.auth.patient_id : req.auth.doc_id;
    sql =
      "select * from prescription where" +
      (role === 1 ? " patient_id=? " : " doc_id=? ");

    result = await query(sql, uid);
    res.send({
      status: 0,
      message: "Get My Prescription List Success!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
