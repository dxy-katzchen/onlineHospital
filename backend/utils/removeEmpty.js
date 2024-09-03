// Remove empty strings, undefined and null properties from objects for updating.
exports.removeEmpty = (obj) => {
  Object.keys(obj).forEach(
    (key) =>
      (obj[key] == null ||
        obj[key] == undefined ||
        obj[key] === "" ||
        obj[key] === -1) &&
      delete obj[key]
  );

  return obj;
};
