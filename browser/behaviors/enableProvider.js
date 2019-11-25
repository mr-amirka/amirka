const isArray = require('../isArray');
const merge = require('../merge');
const _enableProvider = (name) => {
  return {
    [name + 'Enable']: (state) => ({
      ...state,
      [name]: true,
    }),
    [name + 'Disable']: (state) => ({
      ...state,
      [name]: false,
    }),
    [name + 'Toggle']: (state) => ({
      ...state,
      [name]: !state[name],
    }),
  };
};

module.exports = (name) => isArray(name)
    ? merge(name.map(_enableProvider), {})
    : _enableProvider(name);
