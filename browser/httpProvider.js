
const request = require('./request');
const safe = (response) => {
  if (response && response.success) return response;
  throw 'error';
};

module.exports = (rootUrl) => {
	rootUrl || (rootUrl = '');
	const instance = {};
	[ 'post', 'put', 'get', 'delete' ].forEach((method) => {
		instance[method] = (url, options) => request(rootUrl + url, {
      ...options,
      method: method.toUpperCase()
    }).then(safe);
	});
	return instance;
};
