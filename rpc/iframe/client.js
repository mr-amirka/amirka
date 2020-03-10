const Deal = require('../../CancelablePromise');
const {rpcProvider} = require('../rpcWrapper');

module.exports = (childWindow, env) => {
  let parent = childWindow.parent;
  return new Deal((resolve, reject) => {
    function terminate() {
      parent = childWindow = env = null;
    }
    resolve(rpcProvider(env || {}, null, (data) => {
      childWindow.postMessage(data, '*');
    }, (emit) => {
      parent.addEventListener('message', (e) => {
        emit(e.data);
      }, false);
    }).finally((err, response) => {
      err && terminate();
    }).then((exports) => ({
      terminate,
      exports,
    })));
    return terminate;
  });
};
