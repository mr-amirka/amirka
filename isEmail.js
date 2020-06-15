// eslint-disable-next-line
module.exports = (v) => !!(v && /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[0-9]+)?@[a-z0-9-]+(\.[a-z0-9-]{2,})+$/i.exec(v));
