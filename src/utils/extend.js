
module.exports = (dst, src) => {
	for (let k in src) dst[k] = src[k];
	return dst;
};
