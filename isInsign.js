/**
 * @overview isInsign
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = m => {
  if (!m && m !== 0) return true;
  if (typeof m !== 'object') return false;
  const l = m.length;
  if (typeof l === 'number') return l < 1;
  for (let k in m) return false;
  return true;
};
