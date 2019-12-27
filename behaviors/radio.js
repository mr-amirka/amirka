module.exports = {
  select(emit, id) {
    emit(id);
  },
  clear(emit) {
    emit(0);
  },
  toggle(emit, id, getState) {
    emit(getState() === id ? 0 : id);
  },
};
