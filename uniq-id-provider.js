
module.exports = (initialId, prefix) => {
  initialId || (initialId = 0);
  prefix || (prefix = '');
  return () => {
    const id = initialId;
    initialId++;
    return prefix + id;
  };
};
