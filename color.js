const regexpColor = /^[A-Fa-f0-9]+$/;
const regexpSplit = /\s*,\s*/;
const regexpGetColor = /^(#?([A-Fa-f0-9]+)|rgba?\((.*)\))(.*)$/;
const MULTIPLIER = 1.0 / 255;

function substr(v, start, end) {
  return substr(v, start, end);
}
function color(v) {
  return regexpColor.test(v) ? rgbaAlt(normalize(v)) : [v.toLowerCase()];
}
function normalize(v, w, l) {
  if (!v) return [0, 0, 0, 1];
  l = v.length;
  if (l < 2) {
    v += v;
    return getBase([v, v, v]);
  }
  if (l < 3) {
    w = v[0] + v[0];
    return getBase([w, w, w, v[1] + v[1]]);
  }
  if (l < 5) return getBase([v[0] + v[0], v[1] + v[1], v[2] + v[2], v[3] + v[3]]); // eslint-disable-line
  if (l < 6) return getBase([v[0] + v[0], v[1] + v[1], v[2] + v[2], substr(v, 3, 2)]); // eslint-disable-line
  if (l < 7) return getBase([substr(v, 0, 2), substr(v, 2, 2), substr(v, 4, 2)]); // eslint-disable-line
  if (l < 8) return getBase([substr(v, 0, 2), substr(v, 2, 2), substr(v, 4, 2), v[6] + v[6]]); // eslint-disable-line
  return getBase([substr(v, 0, 2), substr(v, 2, 2), substr(v, 4, 2), substr(v, 6, 2)]); // eslint-disable-line
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
function getBase(args) {
  const rgbaColor = [0, 0, 0, 1];
  let v, l = args.length; // eslint-disable-line
  for (;l--;) isNaN(v = parseInt(args[l], 16)) || (rgbaColor[l] = v * MULTIPLIER); // eslint-disable-line
  return rgbaColor;
}
function prepare(args) {
  let arg, l = args.length, output = new Array(l); // eslint-disable-line
  for (; l--;) {
    output[l] = typeof(arg = args[l]) === 'object' ? arg : getColor(arg);
  }
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
  alpha < 1 && output.push('rgba(' + rgb + ',' + alpha.toFixed(2) + ')');
  return output;
}
function __tone(v) {
  return v > 1 ? 1 : (v < 0 ? 0 : v);
}

join.base = joinBase;
getColor.base = getBase;
color.rgbaAlt = rgbaAlt;
color.rgba = rgba;
color.join = join;
color.get = getColor;
color.prepare = prepare;
color.normalize = normalize;
module.exports = color;
