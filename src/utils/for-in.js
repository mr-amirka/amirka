
module.exports = (obj, iteratee) => {
	for (let k in obj) iteratee(obj[k], k);
	return obj;
};
