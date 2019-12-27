const isArray = require('../isArray');
const merge = require('../merge');
const map = require('../map');

module.exports = (behaveProvider) => {
  return (name) => isArray(name)
      ? merge(map(name, behaveProvider), {})
      : behaveProvider(name);
};
