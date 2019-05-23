/**
 * @overview padStart
 * @author Amir Absolutely <mr.amirka@ya.ru>

@example

padStart('2', 4, '0'); // => '0002'

*/

module.exports = (v, length, space) => ('' + v).padStart(length, space || ' ');
