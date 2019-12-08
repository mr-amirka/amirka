const emitterMap = require('./map');
const extend = require('../extend');
const getBase = require('../get').base;
const setBase = require('../set').base;

module.exports = (path, defaultValue) => {
  path = path.split('.');
  return (self) => {
    let cache;
    return emitterMap(
        (v) => (cache = v) && getBase(v, path),
        (v) => setBase(extend({}, cache), path, v),
        defaultValue,
    );
  };
};
