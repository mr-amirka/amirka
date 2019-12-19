module.exports = Object.keys || function(obj) {
  let output = [], prop; // eslint-disable-line
  for (prop in obj) output.push(prop); // eslint-disable-line
  return output;
};
