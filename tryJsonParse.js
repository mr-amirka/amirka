const jsonParse = require('./jsonParse');
module.exports = (s) => {
  try {
    return jsonParse(s);
  } catch (e) {}
  return s;
};
