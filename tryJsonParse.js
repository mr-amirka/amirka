const JSON = require('./json');
module.exports = (s) => {
  try {
    return JSON.parse(s);
  } catch (e) {}
  return s;
};
