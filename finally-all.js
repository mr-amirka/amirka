

module.exports = (fn, callback) => {
  let count = 0;
  fn(() => {
    count++;
  }, callback ? () => {
    --count || callback();
  } : () => {});
};
