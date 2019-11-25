
const interval = require('../async/interval');

module.exports = (fn, timestep, speed) => {
  let $$stop;
  const pause = () => {
    if ($$stop) {
      $$stop();
      $$stop = null;
    }
    return self;
  };
  const play = () => {
    $$stop || ($$stop = interval(() => {
      const iterationsLength = self.speed;
      for (let i = 0; i < iterationsLength; i++) fn();
    }, self.timestep));
    return self;
  };
  const self = {
    speed: speed || 1,
    timestep: timestep || 10,
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
