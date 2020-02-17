module.exports = (promise, onThen) => {
  let stop;
  return promise.then((value) => {
    return stop || onThen(value);
  }).cancel || (() => {
    stop = true;
  });
};
