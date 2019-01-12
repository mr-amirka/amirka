

module.exports = v => v && !!re.exec(v);
const re = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]{2,})+$/i;
