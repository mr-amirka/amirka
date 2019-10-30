
module.exports = Object.keys || function(obj) {
  var output = [], prop;
  for (prop in obj) output.push(prop);
  return output;
};
