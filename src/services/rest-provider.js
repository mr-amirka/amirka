
const forIn = require('../utils/for-in');

module.exports = (http, essenceName, wrappers) => {
	 const instance = {
		post: body => http.post(essenceName, { body }),
		put: (body, where) => http.put(essenceName, {
			body,
			query: { where }
		}),
		get: (where, limit, offset) => http.get(essenceName, {
			query: {
				where: where || {},
				offset: offset || 0,
				limit: limit || 100
			}
		}),
		delete: (where) => http.delete(essenceName, {
			query: { where }
		})
	};
	wrappers && forIn(instance, (method, methodName) => {
		const wrapper = wrappers[methodName];
		wrapper && (instance[methodName] = function(){
			return method.apply(null, arguments).then(wrapper);
		});
	});
	return instance;
}
