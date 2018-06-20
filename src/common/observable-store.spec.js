import {ObservableStore} from './observable-store';

describe('ObservableStore', () => {
  const mergeDepth = 3;
  
  it('Подписка на одно поле', () => {
    let store$ = new ObservableStore();
    let subscriber = jasmine.createSpy('subscriber');
    store$.on([ 'theme.color.1' ], subscriber);
    
    store$.set('theme.color.1', '#A');
    expect(subscriber).toHaveBeenCalledWith('#A');
    
    expect(subscriber.calls.count()).toEqual(1);
  });

  it('Подписка на два поля', () => {
    let store$ = new ObservableStore();
    let subscriber = jasmine.createSpy('subscriber');
    store$.on([ 'theme.color.1', 'theme.color.2' ], subscriber);
    
    store$.set('theme.color.1', '#A');
    expect(subscriber).toHaveBeenCalledWith('#A', undefined);
    
    store$.set('theme.color.2', '#B');
    expect(subscriber).toHaveBeenCalledWith('#A', '#B');
    
    expect(subscriber.calls.count()).toEqual(2);
  });

  it('Отмена подписки', () => {
    let store$ = new ObservableStore();
    let subscriber = jasmine.createSpy('subscriber');
    let unsubscribe = store$.on([ 'theme.color.1', 'theme.color.2' ], subscriber).lastOff;
    
    store$.set('theme.color.1', '#A');
    expect(subscriber).toHaveBeenCalledWith('#A', undefined);
    
    store$.set('theme.color.2', '#B');
    expect(subscriber).toHaveBeenCalledWith('#A', '#B');
    
    unsubscribe();
    store$.set('theme.color.2', '#C');
    expect(subscriber.calls.count()).toEqual(2);
  });

  it('Подписка на родительское поле: установка нумерованных полей для несуществующего объекта', () => {
    let store$ = new ObservableStore();
    let subscriber = jasmine.createSpy('subscriber');
    
    store$.on([ 'theme.color' ], subscriber);
    store$.set('theme.color.1', '#A');
    
    expect(subscriber).toHaveBeenCalledWith([ , '#A' ]);
    store$.set('theme.color.2', '#B');
    
    expect(subscriber).toHaveBeenCalledWith([ , '#A', '#B' ]);
    
    expect(subscriber.calls.count()).toEqual(2);
  });

  it('Подписка на родительское поле: установка нумерованных полей существующего объекта', () => {
    let store$ = new ObservableStore();
    let subscriber = jasmine.createSpy('subscriber');
    store$.on([ 'theme.color' ], subscriber);
    
    store$.set('theme.color', {});
    expect(subscriber).toHaveBeenCalledWith({});
    
    store$.set('theme.color.1', '#A');
    expect(subscriber).toHaveBeenCalledWith({ 1: '#A' });
    
    store$.set('theme.color.2', '#B');
    expect(subscriber).toHaveBeenCalledWith({ 1: '#A', 2: '#B' });
    
    expect(subscriber.calls.count()).toEqual(3);
  });

  it('Подписка на родительское поле: изменение существующего поля', () => {
    let store$ = new ObservableStore();
    let subscriber = jasmine.createSpy('subscriber');
    store$.on([ 'theme.color' ], subscriber);
    
    store$.set('theme.color', {1: '#A'}, mergeDepth);
    expect(subscriber).toHaveBeenCalledWith({1: '#A'});
    
    store$.set('theme.color.1', '#F');
    expect(subscriber).toHaveBeenCalledWith({1: '#F'});
    
    expect(subscriber.calls.count()).toEqual(2);
  });
  
  it('Подписка на родительское поле верхнего уровня', () => {
    let store$ = new ObservableStore();
    let subscriber = jasmine.createSpy('subscriber');
    store$.on([ 'theme' ], subscriber);
    
    store$.set('theme.color', {1: '#A'}, mergeDepth);
    expect(subscriber).toHaveBeenCalledWith({ 
      color: {1: '#A'} 
    });
    
    store$.set('theme.color.1', '#F');
    
    expect(subscriber).toHaveBeenCalledWith({ 
      color: { 1: '#F'} 
    });
    store$.set('theme.color', {foo: 'bar'});
    
    expect(subscriber).toHaveBeenCalledWith({
      color: { 1: '#F', foo: 'bar'}
    });
    expect(subscriber.calls.count()).toEqual(3);
  });

  it('Несколько подписчиков', () => {
    let store$ = new ObservableStore();

    let subscriberTheme1 = jasmine.createSpy('subscriberTheme1');
    let subscriberTheme2 = jasmine.createSpy('subscriberTheme2');
    let subscriberDouble = jasmine.createSpy('subscriberDouble');
    let subscriberTheme1Color1 = jasmine.createSpy('subscriberTheme1Color1');
    let subscriberRoot = jasmine.createSpy('subscriberRoot');
    
    store$
      .on([ 'theme1' ], subscriberTheme1)
      .on([ 'theme2' ], subscriberTheme2)
      .on([ 'theme1', 'theme2' ], subscriberDouble)
      .on([ 'theme1.color.1' ], subscriberTheme1Color1)
      .on(subscriberRoot);

    
    store$.set('theme1.color', {1: '#A'}, mergeDepth);
    expect(subscriberTheme1).toHaveBeenCalledWith({
      color: {1: '#A'}
    });
    expect(subscriberTheme1.calls.count()).toEqual(1);
    expect(subscriberTheme2.calls.count()).toEqual(0);
    expect(subscriberDouble).toHaveBeenCalledWith({
      color: {1: '#A'}
    }, undefined);
    expect(subscriberDouble.calls.count()).toEqual(1);
    expect(subscriberTheme1Color1).toHaveBeenCalledWith('#A');
    expect(subscriberTheme1Color1.calls.count()).toEqual(1);
    expect(subscriberRoot).toHaveBeenCalledWith({
      theme1: {
        color: {1: '#A'}
      }
    });
    expect(subscriberRoot.calls.count()).toEqual(1);


    store$.set('theme1.color.2', '#F00');
    expect(subscriberTheme1).toHaveBeenCalledWith({
      color: {1: '#A', 2: '#F00'}
    });
    expect(subscriberTheme1.calls.count()).toEqual(2);
    expect(subscriberTheme2.calls.count()).toEqual(0);
    expect(subscriberDouble).toHaveBeenCalledWith({
      color: {1: '#A', 2: '#F00'}
    }, undefined);
    expect(subscriberDouble.calls.count()).toEqual(2);
    expect(subscriberTheme1Color1.calls.count()).toEqual(1);
    expect(subscriberRoot).toHaveBeenCalledWith({
      theme1: {
        color: {1: '#A', 2: '#F00'}
      }
    });
    expect(subscriberRoot.calls.count()).toEqual(2);


    store$.set('theme2.color.blue', '#00F');
    expect(subscriberTheme2).toHaveBeenCalledWith({
      color: {blue: '#00F'}
    });
    expect(subscriberTheme1.calls.count()).toEqual(2);
    expect(subscriberTheme2.calls.count()).toEqual(1);
    expect(subscriberDouble).toHaveBeenCalledWith({
      color: {1: '#A', 2: '#F00'}
    }, {
      color: {blue: '#00F'}
    });
    expect(subscriberDouble.calls.count()).toEqual(3);
    expect(subscriberTheme1Color1.calls.count()).toEqual(1);
    expect(subscriberRoot).toHaveBeenCalledWith({
      theme1: {
        color: {1: '#A', 2: '#F00'}
      },
      theme2: {
        color: {blue: '#00F'}
      }
    });
    expect(subscriberRoot.calls.count()).toEqual(3);

    
    store$.set({
      theme1: {
        color: {
          1: '#0F0'
        }
      }
    }, mergeDepth);
    expect(subscriberTheme2).toHaveBeenCalledWith({
      color: {blue: '#00F'}
    });
    expect(subscriberTheme1.calls.count()).toEqual(3);
    expect(subscriberTheme2.calls.count()).toEqual(1);
    expect(subscriberDouble).toHaveBeenCalledWith({
      color: {1: '#0F0', 2: '#F00'}
    }, {
      color: {blue: '#00F'}
    });
    expect(subscriberDouble.calls.count()).toEqual(4);
    expect(subscriberTheme1Color1).toHaveBeenCalledWith('#0F0');
    expect(subscriberTheme1Color1.calls.count()).toEqual(2);
    expect(subscriberRoot).toHaveBeenCalledWith({
      theme1: {
        color: {1: '#0F0', 2: '#F00'}
      },
      theme2: {
        color: {blue: '#00F'}
      }
    });
    expect(subscriberRoot.calls.count()).toEqual(4);

  });


});