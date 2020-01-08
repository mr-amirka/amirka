module.exports = function(w) {
  const d = w.document, de = d.documentElement; //eslint-disable-line
  return function() {
    return [
      w.innerWidth || d.width || de.clientWidth,
      w.innerHeight || d.height || de.clientHeight,
    ];
  };
};
