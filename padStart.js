/**
 * @overview padStart
 * @author Amir Absolutely <mr.amirka@ya.ru>

@example

padStart('2', 4, '0'); // => '0002'

*/
const __padStart = ''.padStart || (String.prototype.padStart = function(length, space) {
  var output = [ this ];
  for (var i = 0; i < length; i++) output.push(space);
  return output.join('');
});
module.exports = (v, length, space) => __padStart.call('' + v, length, space || ' ');
