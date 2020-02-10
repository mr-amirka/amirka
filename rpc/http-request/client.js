const request = require('../../browser/request');
const rpcRequestClientWrapper = require('../requestClientWrapper');

module.exports = (url, env, reconnectTimeout) => {
  return rpcRequestClientWrapper(
      url, env, reconnectTimeout, (url, messages) => {
        return request(url, {
          tryLimit: 0,
          method: 'POST',
          type: 'json',
          body: messages,
        }).finally((err, response) => {
          // console.log({ err, response });
          // ...
        });
      },
  );
};
