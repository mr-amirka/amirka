/**
 * @overview padStart
 * @author Amir Absolutely <mr.amirka@ya.ru>

@example

padStart('2', 4, '0'); // => '0002'

*/
const __padStart = ''.padStart || (String.prototype.padStart = function(length, space) {
  let i = 0, output = [ this ];
  for (; i < length; i++) output.push(space);
  return output.join('');
});
module.exports = (v, length, space) => __padStart.call('' + v, length, space || ' ');
