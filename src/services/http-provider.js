
const request = require('./request');
module.exports = (rootUrl) => {
	rootUrl || (rootUrl = '');
	const instance = {};
	[ 'post', 'put', 'get', 'delete' ].forEach((method) => {
		instance[method] = (url, options) => request(rootUrl + url, { ...options, method });
	});
	return instance;
};
