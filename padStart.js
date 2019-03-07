/**
 * @overview padStart
 * @author Absolutely Amir <mr.amirka@ya.ru>

@example

padStart('2', 4, '0'); // => '0002'

*/

module.exports = (value, length, space) => ('' + value).padStart(length, space || ' ');
