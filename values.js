
module.exports = Object.values || function(obj) {
  var output = [], prop;
  for (prop in obj) output.push(obj[prop]);
  return output;
};
