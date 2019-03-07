const map = require('../map');
const scalar = v => [ 'scalar', v ];

module.exports = (wrappers) => {
  const handlers = {
    object: (v, path) => {
      path && (path += '.');
      return [ 'object', map(v, (v, k) => encode(path + k, v)) ];
    }
  };

  for (let k in wrappers) handlers[k] = wrappers[k](handlers[k]);

  const encode = (path, input) => {
    return (input ? (handlers[typeof input] || scalar) : scalar)(input, path);
  };

  return (input) => encode('', input);
};
