
//const forIn = require('../forIn');
const extend = require('../extend');

module.exports = (http, options, wrappers) => {
  const __extend = dst => extend(dst, options);
	const instance = {
		post: body => http.post(__extend({ body })),
		put: (body, where) => http.put(__extend({
			body,
			query: { where }
		})),
		get: (query) => http.get(__extend({
			query
		})),
		delete: (where) => http.delete(__extend({
			query: { where }
		}))
	};
  /*
	forIn(wrappers, (wrapper, methodName) => {
		instance[methodName] = wrapper(instance[methodName]);
	});
  */
	return instance;
}
