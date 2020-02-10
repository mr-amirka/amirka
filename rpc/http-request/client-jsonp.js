const jsonp = require('../../browser/jsonp');
const rpcRequestClientWrapper = require('../requestClientWrapper');

module.exports = (url, env, reconnectTimeout) => {
  return rpcRequestClientWrapper(
      url, env, reconnectTimeout, (url, messages) => {
        return jsonp(url, {
          messages,
        });
      },
  );
};
