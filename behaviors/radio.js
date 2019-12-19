module.exports = {
  select: (state, id) => id,
  clear: () => 0,
  toggle: (state, id) => state === id ? 0 : id,
};
