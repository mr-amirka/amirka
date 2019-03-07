module.exports = v => v && !!re.exec(v);
const re = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
