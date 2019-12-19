const isArray = require('../isArray');
const merge = require('../merge');

function _radioProvider(name) {
  return {
    [name + 'Select']: (state, id) => ({
      ...state,
      [name]: id,
    }),
    [name + 'Clear']: (state) => ({
      ...state,
      [name]: 0,
    }),
    [name + 'Toggle']: (state, id) => ({
      ...state,
      [name]: state[name] === id ? 0 : id,
    }),
  };
};
module.exports = (name) => isArray(name)
    ? merge(name.map(_radioProvider), {})
    : _radioProvider(name);
