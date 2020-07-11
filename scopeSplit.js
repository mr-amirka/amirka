/*
scopeSplit('not(.disabled(.as).lak).checked', '(', ')');
// =>
[
  ['not', [
    ['.disabled', [
      ['.as']
    ]],
    ['.lak']
  ]],
  ['.checked']
]
*/

const push = require('./push');

module.exports = (input, startKey, endKey) => {
  startKey = startKey || '(';
  endKey = endKey || ')';
  let top = [], levels = [top], startL = startKey.length, // eslint-disable-line
    endL = endKey.length, offset = 0, prevLevel, start, // eslint-disable-line
    depth = 0, lastOffset = 0, length = input.length, level = top; // eslint-disable-line
  while (offset < length) {
    (start = input.startsWith(startKey, offset))
    || input.startsWith(endKey, offset)
      ? (
        push(level, [
          input.substr(lastOffset, offset - lastOffset),
        ]),
        start
          ? (
            depth++,
            offset += startL
          )
          : (
            levels[depth] = [],
            prevLevel = levels[--depth],
            prevLevel[prevLevel.length - 1][1] = level,
            offset += endL
          ),
        lastOffset = offset,
        level = levels[depth] || (levels[depth] = [])
      )
      : (
        offset++
      );
  }
  lastOffset < length && push(top, [
    input.substr(lastOffset, length - lastOffset),
  ]);
  return top;
};

/*
const regexpScopeExtract = /(\[)|(\])/g;

function scopeSplit(input) {
  const top = [], levels = [top]; // eslint-disable-line
  let depth = 0, lastOffset = 0; // eslint-disable-line
  input.replace(regexpScopeExtract, (haystack, start, end, offset) => {
    const level = levels[depth] || (levels[depth] = []);
    push(level, [
      input.substr(lastOffset, offset - lastOffset),
    ]);
    if (start) {
      depth++;
    } else {
      levels[depth] = [];
      depth--;
      const prevLevel = levels[depth];
      prevLevel[prevLevel.length - 1][1] = level;
    }
    lastOffset = offset + 1;
    return '';
  });
  const endFragment = input.substr(lastOffset, input.length - lastOffset);
  endFragment && top.push([endFragment]);
  return top;
}
*/
