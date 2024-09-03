const { query } = require("../db");

/**
 * @api {post} /drug/add Add drugs
 * @apiDescription Add drugs(admin)
 * @apiName addDrug
 * @apiGroup Drug
 * @apiBody {string} drug_name Name of drug, not to be duplicated
 * @apiBody {string} usage usage
 * @apiBody {string} cure Diseases treated
 * @apiBody {number} drug_price unit price
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiZW1haWwiOiIxMzYzODY3OTc1QHFxLmNvbSIsInBob25lIjoiMTk4NjEzNzYwMDkiLCJwYXNzd29yZCI6IiIsInJvbGUiOjMsImlhdCI6MTY4MTEwNDc0NiwiZXhwIjoxNzEyNjQwNzQ2fQ.pCQf5b5Y05mCkCmABmI66kbQUuytgl59g5F-pwuTPDE"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     drug_name:"sleeping pill",
 *     usage:"10 tablets 3 times a day.",
 *     cure:"Treatment of depression, mania, schizophrenia",
 *     single_price:20,
 * 
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Add successfully",
}
 * @apiVersion 1.0.0
 */
exports.addDrugs = async (req, res) => {
  const { role } = req.auth;
  if (role !== 3) return res.cc("Authorization Error");
  let sql, result;
  try {
    sql = "select * from drug where drug_name=?";
    result = await query(sql, req.body.drug_name);
    if (result.length !== 0) return res.cc("Duplicate drug names!");

    sql = "insert into drug set ?";
    result = await query(sql, req.body);
    if (result.affectedRows !== 1) return res.cc("Add Failure");

    res.cc("Add successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /drug/Info Obtaining drug information
 * @apiDescription Get drug details by drug name(common)
 * @apiName getDrugInfo
 * @apiGroup Drug
 * @apiBody {string} drug_name drug name
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiZW1haWwiOiIxMzYzODY3OTc1QHFxLmNvbSIsInBob25lIjoiMTk4NjEzNzYwMDkiLCJwYXNzd29yZCI6IiIsInJvbGUiOjMsImlhdCI6MTY4MTEwNDc0NiwiZXhwIjoxNzEyNjQwNzQ2fQ.pCQf5b5Y05mCkCmABmI66kbQUuytgl59g5F-pwuTPDE"
 *     }
 * @apiExample {js} Example Request:
 * {
 *     //All required
 *     drug_name:"sleeping pill",
 * }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Success in obtaining drug information!",
    "data": {
        "drug_name": "sleeping pill",
        "usage": "10 tablets 3 times a day.",
        "cure": "Treatment of depression, mania, schizophrenia",
        "single_price": 20
    }
}
 * @apiVersion 1.0.0
 */
exports.getDrugInfo = async (req, res) => {
  const { drug_name } = req.body;
  let sql, result;
  try {
    sql = "select * from drug where drug_name=?";
    result = await query(sql, drug_name);
    if (result.length !== 1) return res.cc("The drug is not available");
    res.send({
      status: 0,
      message: "Success in obtaining drug information!",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /drug/getList Get a list of drugs
 * @apiDescription Get a list of drugs by drug name(doctor,admin)
 * @apiName getDrugList
 * @apiGroup Drug
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiZW1haWwiOiIxMzYzODY3OTc1QHFxLmNvbSIsInBob25lIjoiMTk4NjEzNzYwMDkiLCJwYXNzd29yZCI6IiIsInJvbGUiOjMsImlhdCI6MTY4MTEwNDc0NiwiZXhwIjoxNzEyNjQwNzQ2fQ.pCQf5b5Y05mCkCmABmI66kbQUuytgl59g5F-pwuTPDE"
 *     }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Getting drug list successful",
    "data": [
        {
            "drug_name": "Rubus frutescens (botany)",
            "usage": "2 capsules at a time",
            "cure": "Treatment of diarrhea, abdominal pain",
            "single_price": 20
        },
        {
            "drug_name": "sleeping pill",
            "usage": "10 tablets 3 times a day.",
            "cure": "Treatment of depression, mania, schizophrenia",
            "single_price": 20
        },
        {
            "drug_name": "ibuprofen",
            "usage": "2 capsules at a time",
            "cure": "Treatment of menstrual cramps and headaches",
            "single_price": 20
        },
        {
            "drug_name": "Huo Xiang Zheng Qi Pill (botany)",
            "usage": "packet",
            "cure": "For diarrhea, nausea",
            "single_price": 15
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getDrugList = async (req, res) => {
  const { role } = req.auth;
  if (role === 1) res.cc("Authorization Error");
  let sql, result;
  try {
    sql = "select * from drug";
    result = await query(sql);

    res.send({
      status: 0,
      message: "Getting drug list successful",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /drug/delete Deletion of drugs
 * @apiDescription Deletion of drugs based on drug name(admin)
 * @apiName deleteDrug
 * @apiGroup Drug
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiZW1haWwiOiIxMzYzODY3OTc1QHFxLmNvbSIsInBob25lIjoiMTk4NjEzNzYwMDkiLCJwYXNzd29yZCI6IiIsInJvbGUiOjMsImlhdCI6MTY4MTEwNDc0NiwiZXhwIjoxNzEyNjQwNzQ2fQ.pCQf5b5Y05mCkCmABmI66kbQUuytgl59g5F-pwuTPDE"
 *     }
 * @apiSuccessExample {json} Return Content:
{
    "status": 0,
    "message": "Deletion of drugs successful!",
    
}
 * @apiVersion 1.0.0
 */
exports.deleteDrug = async (req, res) => {
  const { role } = req.auth;
  const { drug_name } = req.body;
  if (role !== 3) return res.cc("Authorization Error");
  let sql, result;
  try {
    sql = "delete from drug where drug_name=?";
    result = await query(sql, drug_name);
    if (result.affectedRows !== 1) return res.cc("Failed to delete drug");

    res.cc("Deletion of drugs successful!", 0);
  } catch (error) {
    res.cc(error);
  }
};
