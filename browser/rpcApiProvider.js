const decodeProvider = require('../jsonRpc/decodeProvider');
const request = require('./request');


module.exports = (url) => {

  const decode = decodeProvider({
    'function': origin => {
      return v => {
        const path = url + v;
        return (...params) => request(path, {
          tryLimit: 0,
          method: 'POST',
          type: 'json',
          body: params
        }).then(middleware);
      }
    }
  });

  return request(url, {
    tryLimit: 0,
    method: 'POST',
    type: 'json'
  }).finally((err, response) => {
    //console.log({ err, response });
  }).then((response) => {
    return {
      exports: decode(response)
    };
  });
};

const middleware = ([ hasError, result, error ]) => {
  if (hasError) throw error;
  return result;
};
