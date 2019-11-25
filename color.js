const regexpColor = /^[A-Fa-f0-9]+$/;
const color = module.exports = (v) => {
  return regexpColor.test(v) ? rgbaAlt(__normalize(v)) : [v.toLowerCase()];
};

const __normalize = color.normalize = (v) => {
  if (!v) return [0, 0, 0, 1];
  const l = v.length;
  if (l < 2) {
    v += v;
    return getBase([v, v, v]);
  }
  if (l < 3) {
    const w = v[0] + v[0];
    return getBase([w, w, w, v[1] + v[1]]);
  }
  if (l < 5) return getBase([v[0] + v[0], v[1] + v[1], v[2] + v[2], v[3] + v[3]]); // eslint-disable-line
  if (l < 6) return getBase([v[0] + v[0], v[1] + v[1], v[2] + v[2], v.substr(3, 2)]); // eslint-disable-line
  if (l < 7) return getBase([v.substr(0, 2), v.substr(2, 2), v.substr(4, 2)]);
  if (l < 8) return getBase([v.substr(0, 2), v.substr(2, 2), v.substr(4, 2), v[6] + v[6]]); // eslint-disable-line
  return getBase([v.substr(0, 2), v.substr(2, 2), v.substr(4, 2), v.substr(6, 2)]); // eslint-disable-line
};
const k = 1.0 / 255;

const getColor = color.get = (input) => {
  const matchs = /^(([A-Fa-f0-9]+)|rgba?\((.*)\))(.*)$/.exec(input);
  if (!matchs) return [0, 0, 0, 1];
  const c16 = matchs[2];
  if (c16) return __normalize(c16);
  const tones = matchs[3].split(/\s*,\s*/);
  const output = [0, 0, 0, 1];
  let v, i = tones.length; // eslint-disable-line
  if (i > 3) {
    i = 3;
    isNaN(v = parseFloat(v = tones[3])) || (output[3] = v);
  }
  for (;i--;) isNaN(v = parseInt(tones[i])) || (output[i] = v * k);
  return output;
};
const getBase = getColor.base = (args) => {
  const rgbaColor = [0, 0, 0, 1];
  for (let v, l = args.length; l--;) {
    isNaN(v = parseInt(args[l], 16)) || (rgbaColor[l] = v * k);
  }
  return rgbaColor;
};
const prepare = color.prepare = (args) => {
  let arg, l = args.length, output = new Array(l); // eslint-disable-line
  for (; l--;) {
    output[l] = typeof(arg = args[l]) === 'object' ? arg : getColor(arg);
  }
  return output;
};
const join = color.join = (args) => rgba(joinBase(prepare(args)));
const joinBase = join.base = (args) => {
  let i, output = [0, 0, 0, 0], input, l = args.length; // eslint-disable-line
  for (; l--;) {
    for (input = args[l], i = input.length; i--;) output[i] += (input[i] || 0);
  }
  return output;
};
const rgba = color.rgba = (rgbaColor) => {
  let output = [0, 0, 0, __tone(rgbaColor[3])], i = 3; // eslint-disable-line
  for (; i--;) output[i] = Math.round(__tone(rgbaColor[i]) * 255);
  return 'rgba(' + output.join(',') + ')';
};
const rgbaAlt = color.rgbaAlt = (rgbaColor) => {
  let output = [0, 0, 0], i = 3; // eslint-disable-line
  for (; i--;) output[i] = Math.round(__tone(rgbaColor[i]) * 255);
  const rgb = output.join(',');
  const alpha = __tone(rgbaColor[3]);
  const _output = ['rgb(' + rgb + ')'];
  alpha < 1 && _output.push('rgba(' + rgb + ',' + alpha + ')');
  return _output;
};
function __tone(v) {
  return v > 1 ? 1 : (v < 0 ? 0 : v);
}
