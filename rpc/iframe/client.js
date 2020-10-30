const CancelablePromise = require('../../CancelablePromise');
const {rpcProvider} = require('../rpcWrapper');

module.exports = (childWindow, env) => {
  let parent = childWindow.parent;
  return new CancelablePromise((resolve, reject) => {
    function terminate() {
      parent = childWindow = env = null;
    }
    resolve(rpcProvider(env || {}, null, (data) => {
      childWindow && childWindow.postMessage(data, '*');
    }, (emit) => {
      parent && parent.addEventListener('message', (e) => {
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
