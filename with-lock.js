
module.exports = (fn) => {
  let locked;
	return function() {
    if (locked) return;
    locked = true;
    const result = fn.apply(this, arguments);
    locked = false;
		return result;
	};
};
