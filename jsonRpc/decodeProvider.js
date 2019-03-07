const map = require('../map');
const scalar = v => v;

module.exports = (wrappers) => {

  const handlers = {
    scalar,
    object: v => map(v, decode),
  };

  for (let k in wrappers) handlers[k] = wrappers[k](handlers[k]);

  const decode = (input) => {
    if (!input) return null;
    const handle = handlers[input[0]];
    if (!handle) return null;
    return handle(input[1]);
  };

  return decode;
};
