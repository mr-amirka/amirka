const __interval = require('../async/interval');
const runtime = require('../runtime');

module.exports = ((g) => {
  const requestAnimationFrame = g.requestAnimationFrame || g.mozRequestAnimationFrame ||
      g.webkitRequestAnimationFrame || g.msRequestAnimationFrame;
  let lastTime = runtime();
  return requestAnimationFrame ? (callback, _delay) => {
    let stop, balance = 0;
    function step() {
      if (stop) return;
      const time = runtime();
      const delta = time - lastTime;
      const def = balance + delta - _delay;
      if (def > 0) {
        balance = def;
        lastTime = time;
        callback(delta);
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    return () => {
      stop = true;
    };
  } : __interval;
})(window);
