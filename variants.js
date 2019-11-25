const unslash = require('./unslash');
const escapedSplitProvider = require('./escapedSplitProvider');
const joinArrays = require('./joinArrays');
const variants = module.exports = (exp) => base(exp).map(unslash);

// Экранирование служебных символов
const __split = escapedSplitProvider('|').base; // support escape
const regexpScope = /([^)(\\]+|\\.)|([\(\)])/gi;
const __push = [].push;
const __build = variants.build = (childs) => {
  const length = childs.length;
  const output = [];
  let parts, child, end, pi, pl, i = 0;
  let next, prev = [ '' ];
  for (; i < length; i++) {
    child = childs[i];
    parts = __split(child.prefix);
    pl = parts.length;
    end = pl - 1;
    joinArrays(next = [], [ parts[end] ], __build(child.childs));
    if (end) {
      joinArrays(output, prev, [ parts[0] ]);
      prev = next;
      for (pi = 1; pi < end; pi++) output.push(parts[pi]);
    } else {
      prev = joinArrays([], prev, next);
    }
  }
  __push.apply(output, prev);
  return output;
};
const base = variants.base = (exp) => {
  const levels = {};
  const childs = levels[0] = [];
  let depth = 0;
  let parts = [];
  exp.replace(regexpScope, (haystack, _prefix, scope) => {
    if (_prefix) {
      parts.push(_prefix);
      return '';
    }
    let last;
    if (scope == '(') {
      (levels[depth] || (levels[depth] = [])).push(last = {prefix: parts.join('') });
      depth++;
      levels[depth] = last.childs = [];
    } else {
      levels[depth].push({prefix: parts.join(''), childs: []});
      if (--depth < 0) depth = 0;
    }
    parts = [];
    return '';
  });
  if (parts.length) levels[depth].push({prefix: parts.join(''), childs: []});
  return __build(childs);
};
