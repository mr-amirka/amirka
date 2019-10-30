
const __splice = [].splice;
const __indexOf = [].indexOf;
module.exports = (collection, item) => {
  __indexOf.call(collection, item) > -1 || __push.call(collection, item);
  return collection;
};
