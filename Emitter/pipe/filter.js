const getter = require('../set').getter;

module.exports = (check) => {
  check = getter(check);
  return (self) => {
    const {on} = self;
    return self.fork({
      on: (watcher) => on((value) => {
        check(value) && watcher(value);
      }),
    });
  };
};
