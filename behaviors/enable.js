module.exports = {
  enable(emit) {
    emit(1);
  },
  disable(emit) {
    emit(0);
  },
  toggle(emit, _, getState) {
    emit(!getState());
  },
};
