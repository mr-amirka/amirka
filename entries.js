
module.exports = Object.entries || function(obj) {
  var output = [], prop;
  for (prop in obj) output.push(prop, obj[prop]);
  return output;
};
