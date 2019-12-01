const loopAsync = require('./loop');

module.exports = (items, fn, immediate) => {
  let index = 0;
  return loopAsync(() => index < items.length, () => {
    const i = index;
    index++;
    return fn(items[i], i);
  }, immediate);
};
