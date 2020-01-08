const isObject = require('./isObject');
const trimZero = require('./trimProvider')('0');

const regexpColor = /^[A-Fa-f0-9]+$/;
const regexpSplit = /\s*,\s*/;
const regexpGetColor = /^(#?([A-Fa-f0-9]+)|rgba?\((.*)\))(.*)$/;
const MULTIPLIER = 1.0 / 255;
const MULTIPLIER_ONE = 1.0 / 15;

function color(v) {
  return regexpColor.test(v) ? rgbaAlt(normalize(v)) : [v.toLowerCase()];
}
function one(v) {
  return parseInt(v, 16) * MULTIPLIER_ONE;
}
function double(v, start) {
  return parseInt(v.substr(start, 2), 16) * MULTIPLIER;
}
function normalize(v, w, l) {
  if (!v) return [0, 0, 0, 1];
  l = v.length;
  if (l < 2) {
    v = one(v);
    return [v, v, v, 1];
  }
  if (l < 3) {
    w = one(v[0]);
    return [w, w, w, one(v[1])];
  }
  if (l < 4) return [one(v[0]), one(v[1]), one(v[2]), 1];
  if (l < 5) return [one(v[0]), one(v[1]), one(v[2]), one(v[3])];
  if (l < 6) return [one(v[0]), one(v[1]), one(v[2]), double(v, 3)];
  if (l < 7) return [double(v, 0), double(v, 2), double(v, 4), 1];
  if (l < 8) return [double(v, 0), double(v, 2), double(v, 4), one(v[6])];
  return [
    double(v, 0), double(v, 2), double(v, 4),
    l < 8
      ? one(v[6])
      : double(v, 6),
  ];
}
function getColor(input, parts, v, i, output) {
  parts = regexpGetColor.exec(input);
  if (!parts) return [0, 0, 0, 1];
  if (v = parts[2]) return normalize(v);
  parts = parts[3].split(regexpSplit);
  output = [0, 0, 0, 1];
  i = parts.length;
  i > 3 && (i = 3, isNaN(v = parseFloat(v = parts[3])) || (output[3] = v));
  for (;i--;) isNaN(v = parseInt(parts[i])) || (output[i] = v * MULTIPLIER);
  return output;
}
function prepare(args) {
  let arg, l = args.length, output = new Array(l); // eslint-disable-line
  for (; l--;) output[l] = isObject(arg = args[l]) ? arg : getColor(arg);
  return output;
}
function join(args) {
  return rgba(joinBase(prepare(args)));
}
function joinBase(args) {
  let i, output = [0, 0, 0, 0], input, l = args.length; // eslint-disable-line
  for (; l--;) {
    for (input = args[l], i = input.length; i--;) output[i] += (input[i] || 0);
  }
  return output;
}
function rgba(rgbaColor) {
  let output = [0, 0, 0, __tone(rgbaColor[3])], i = 3; // eslint-disable-line
  for (; i--;) output[i] = Math.round(__tone(rgbaColor[i]) * 255);
  return 'rgba(' + output.join(',') + ')';
}
function rgbaAlt(rgbaColor) {
  let output = [0, 0, 0], i = 3; // eslint-disable-line
  for (; i--;) output[i] = Math.round(__tone(rgbaColor[i]) * 255);
  const rgb = output.join(',');
  const alpha = __tone(rgbaColor[3]);
  output = ['rgb(' + rgb + ')'];
  alpha < 1 && output.push(
      'rgba(' + rgb + ',' + (trimZero(alpha.toFixed(2)) || '0') + ')',
  );
  return output;
}
function __tone(v) {
  return Math.min(1, Math.max(0, v));
}

join.base = joinBase;
color.rgbaAlt = rgbaAlt;
color.rgba = rgba;
color.join = join;
color.get = getColor;
color.prepare = prepare;
color.normalize = normalize;
module.exports = color;
