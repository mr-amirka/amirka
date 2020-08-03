const create = require('./create');
const extend = require('./extend');

module.exports = (Parent, constructor, proto) => {
  function Child() {
    const self = this, args = arguments; //eslint-disable-line
    Parent.apply(self, args);
    constructor.apply(self, args);
  }
  Child.prototype = extend(create(Parent.prototype), proto);
  return Child;
};
