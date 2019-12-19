const Emitter = require('./index');
const {isEmitter} = Emitter;
const merge = require('../merge');
const forIn = require('../forIn');

/*
  Добавление экземпляру эмиттера методов.
  @example:
  const emitter = emitterProvider(false);

  // добавление методов
  emitter.behave({
    enable: () => true,
    disable: () => false,
    toggle: state => !state
  });

  // использование методов
  emitter.enable();
  emitter.disable();
  emitter.toggle(); // переключение тумблера


  @example:
  const emitter = emitterProvider(0);
  // добавление методов
  emitter.behave({
    select: (state, id) => id,
    clear: () => 0,
    toggle: (state, id) => state === id ? 0 : id
  });

  // использование методов
  emitter.select(10); // выбрали пункт меню с id 10
  emitter.clear(); // очистка
  emitter.toggle(10); // если этот элемент был выбран, то очистка,
    если элемент не был выбран, то он выбирается.

  @example:
  const emitter = emitterProvider(false);
  const enableBehavior = {
    enable: () => true,
    disable: () => false
  };
  const toggleBehavior = {
    toggle: state => !state
  };

  // добавление методов
  emitter.behave([ enableBehavior, toggleBehavior ]);

  // использование методов
  emitter.enable();
  emitter.disable();
  emitter.toggle();
*/

module.exports = (value, methods) => {
  const self = isEmitter(value) ? value : new Emitter(value);
  const {getValue, emit} = self;
  forIn(merge(methods), (method, methodName) => {
    self[methodName] = (value) => {
      emit(method(value, getValue()));
    };
  });
  return self;
};
