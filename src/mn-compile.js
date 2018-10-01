require("./standalone-shims/css.escape.shim");
const minimalistNotationProvider = require("./minimalist-notation-provider");
const { isArray } = require("./utils");
module.exports = (presets) => {
  const {
    setPresets,
    recompileFrom,
    emitter,
  } = minimalistNotationProvider();
  isArray(presets) && setPresets(presets);
  return (attrsMap) => {
    recompileFrom(attrsMap);
    return emitter.getValue().map(__itemMap).join('');
  };
};
const __itemMap = item => item.content;
