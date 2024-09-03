//拼接sql字符串
exports.concatSqlStr = function (sql, attrArray, queryInfo) {
  attrArray.forEach((currvar) => {
    if (currvar in queryInfo) {
      if (sql.split("=").length > sql.split("and").length) {
        sql += " and";
      }
      if (typeof queryInfo[currvar] === "string") {
        // If the data is of string type, single quotes are required.
        sql += ` ${currvar}='${queryInfo[currvar]}'`;
      } else {
        sql += ` ${currvar}=${queryInfo[currvar]}`;
      }
    }
  });

  return sql;
};
