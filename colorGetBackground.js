const color = require('./color');
const splitProvider = require('./splitProvider');
const camelToKebabCase = require('./camelToKebabCase');

const regexpBg = /^([A-Fa-f0-9]+)(p([0-9]+)([a-z%]*))?$/i;
const regexpAngle = /^(.*)((\_r)_?([A-Za-z_]*)|\_g(\-?[0-9]+))$/i;
const regexpRepeat = /^(.*)_rpt$/i;
const splitDelimeter = splitProvider('-');
const splitSuffix = splitProvider(/_+/);

module.exports = (input) => {
  let radial = '', repeating, matches, angle = 180, i, vi, v = input; // eslint-disable-line
  if (matches = regexpRepeat.exec(v)) {
    repeating = 1;
    v = matches[1];
  }
  if (matches = regexpAngle.exec(v)) {
    v = matches[1];
    if (matches[3]) {
      radial = splitSuffix(camelToKebabCase(matches[4] || 'circle')).join(' ');
    } else {
      vi = matches[5];
      angle = (angle + (vi ? parseInt(vi) : 0)) % 360;
      if (angle < 0) angle += 360;
    }
  }
  const vls = splitDelimeter(v);
  const l = vls.length;
  const end = Math.max(l - 1, 1);
  const prefix = (repeating ? 'repeating-' : '')
    + (radial ? 'radial' : 'linear')
    + '-gradient(' + (radial || ('' + angle + 'deg'));
  const gradient = [], outputRgb = [prefix], outputRgba = [prefix]; // eslint-disable-line
  let alts, rgb, rgba, suffix, pmatches, hasAlpha = false; // eslint-disable-line
  for (i = 0; i < l; i++) {
    pmatches = regexpBg.exec(v = vls[i]) || [];
    suffix = ' '
      + (pmatches[3] || (end ? Math.round(i * 100 / end) : 0))
      + (pmatches[4] || '%');
    alts = color(pmatches[1] || v || Math.round(i * 15 / end).toString(16));
    i || gradient.push.apply(gradient, alts); // eslint-disable-line
    rgb = alts[0];
    (rgba = alts[1]) ? (hasAlpha = 1) : (rgba = rgb);
    outputRgb.push(rgb + suffix);
    outputRgba.push(rgba + suffix);
  }
  if (l > 1) {
    gradient.push(outputRgb.join(',') + ')');
    hasAlpha && gradient.push(outputRgba.join(',') + ')');
  }
  return gradient;
};
