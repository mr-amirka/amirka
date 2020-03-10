module.exports = () => {
  let first = [0, 0], last = first; // eslint-disable-line
  return [
    (_next) => {
      if (_next = first[1]) {
        first = _next;
        return _next[0];
      }
    },
    (data) => {
      last = last[1] = [data, 0];
    },
  ];
};
