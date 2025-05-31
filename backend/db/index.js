const mysql = require("mysql2");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "iKuuoLRIep3zfoSU",
  database: "online_hospital",
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
