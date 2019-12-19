module.exports = Object.entries || function(obj) {
  let output = [], prop; // eslint-disable-line
  for (prop in obj) output.push([prop, obj[prop]]); // eslint-disable-line
  return output;
};
