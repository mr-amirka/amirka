const behave = require('../Emitter/behave');

module.exports = (emitter, id) => behave(
    emitter.map((_id) => _id === id, (enable) => enable ? id : 0),
    require('./enable'),
);
