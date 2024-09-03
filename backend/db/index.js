const mysql = require("mysql2");

const db = mysql.createPool({
  host: "xxx",
  user: "xxx",
  password: "xxx",
  database: "xxx",
});

const query = (sql, ...valueArgs) =>
  new Promise((resove, reject) => {
    const values = valueArgs.flat();
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      }
      resove(result);
    });
  });

module.exports = { query };
