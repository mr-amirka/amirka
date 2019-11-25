const runtime = require('../runtime');
const { floatval } = require('../anyval');

const runFrame = require('./runFrame');

module.exports = (fn, fps, speed) => {
  let $$stop, lastTime = runtime();
  const pause = () => {
    if ($$stop) {
      $$stop();
      $$stop = null;
    }
    return self;
  };

  /*
  let fi = 0, fpsCheckTime = 5, itq = 1 / fpsCheckTime;
  setInterval(function(){
    var fps = fi * itq;
    console.log('frame: fi, fps, max fps', fi, fps, self.fps);
    fi = 0;
  }, 1000 * fpsCheckTime);
  */

  function frame() {
    //fi++;
    var time = runtime();
    var diff = time - lastTime;
    lastTime = time;
    fn(diff * speed);
  }
  const play = () => {
    $$stop || ($$stop = runFrame(frame, 1000 / floatval(self.fps, 1, 1, 100)));
    return self;
  };
  const self = {
    speed: speed || 1,
    fps: fps || 25,
    update: () => {
      pause();
      return play();
    },
    pause,
    play,
    isPlaying: () => !!$$stop
  };
  return self;
};
