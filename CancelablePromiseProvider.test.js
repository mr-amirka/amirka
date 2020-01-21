const CancelablePromise = require('./CancelablePromiseProvider')({
  defer: require('./defer'),
  ParentClass: require('./support')('Promise'),
});

const DEFAULT_TIMEOUT = 100;

describe('CancelablePromise', () => {
  test('it should resolve promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      resolve(10);
    });
    expect(await cancelablePromise).toBe(10);
  });

  test('it should reject promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve, reject) => {
      reject(new Error('Ooops!'));
    });
    const promise = new Promise((resolve) => {
      cancelablePromise.catch(resolve);
    });
    expect(await promise).toEqual(new Error('Ooops!'));
  });

  test('it should cancel promise', async () => {
    const promise = new Promise((topResolve, topReject) => {
      let cancelCount = 0;
      const cancelablePromise = new CancelablePromise((resolve) => {
        topReject(new Error('promise initialization executed'));
        resolve(10);
      }).then(
          () => {
            topReject(new Error('promise "then" resolve callback executed'));
          },
          () => {
            topReject(new Error('promise "then" reject callback executed'));
          },
          () => {
            cancelCount++;
          },
      );
      cancelablePromise.cancel();

      setTimeout(() => {
        topResolve(cancelCount);
      }, DEFAULT_TIMEOUT);
    });
    expect(await promise).toEqual(1);
  });

  test('it should add cancel event listener', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        topReject(new Error('promise initialization executed'));
        resolve(10);
      });
      cancelablePromise
          .then(() => {
            topReject(new Error('promise "then" callback executed'));
          })
          .onCancel(topResolve)
          .cancel();
    });
  });

  test('"onCancel" as "then" args', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        topReject(new Error('promise initialization executed'));
        resolve(10);
      });
      cancelablePromise.then(
          // then
          () => {
            topReject(new Error('promise "then" callback executed'));
          },
          // catch
          null,
          // cancel
          topResolve,
      ).cancel();
    });
  });

  test('it should cancel promise if canceled all child promises', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        topReject(new Error('promise initialization executed'));
        resolve('Hello!');
      });
      const childCancelablePromise1 = cancelablePromise.then(() => {
        topReject(new Error('child promise 1 "then" callback executed'));
      });
      const childCancelablePromise2 = cancelablePromise.then(() => {
        topReject(new Error('child promise 2 "then" callback executed'));
      });
      const childCancelablePromise3 = cancelablePromise.then(() => {
        topReject(new Error('child promise 3 "then" callback executed'));
      });
      childCancelablePromise1.cancel();
      childCancelablePromise2.cancel();
      childCancelablePromise3.cancel();

      setTimeout(topResolve, DEFAULT_TIMEOUT);
    });
  });

  /* eslint-disable-next-line */
  test('it should resolve promise if canceled 2 of 3 child promises', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        resolve('Hello!');
      });
      const childCancelablePromise1 = cancelablePromise.then(() => {
        topReject(new Error('child promise 1 "then" callback executed'));
      });
      const childCancelablePromise2 = cancelablePromise.then(() => {
        topReject(new Error('child promise 2 "then" callback executed'));
      });
      cancelablePromise.then((val) => {
        expect(val).toBe('Hello!');
        topResolve();
      });
      childCancelablePromise1.cancel();
      childCancelablePromise2.cancel();
    });
  });

  test('it should extract inner promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      const innerCancelablePromise = new CancelablePromise((resolve) => {
        resolve('resolved');
      });
      resolve(innerCancelablePromise);
    }).then((value) => {
      return new CancelablePromise((resolve) => {
        resolve(value + ' promise');
      });
    });
    expect(await cancelablePromise).toBe('resolved promise');
  });

  test('it should execute "finally" callback if resolved promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      resolve('Hello world!');
    });
    const childCancelablePromise = cancelablePromise
        .then((v) => {
          return v + '!';
        })
        .then((v) => {
          return v + '!';
        })
        .finally((error, val) => {
          expect(val).toBe('Hello world!!!');
          expect(error).toBe(null);
        });
    expect(await childCancelablePromise).toBe('Hello world!!!');
  });

  test('it should execute "finally" callback if rejected promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve, reject) => {
      reject(new Error('Ooops!'));
    });
    const childCancelablePromise = cancelablePromise.finally((error, val) => {
      expect(val).toBe(undefined);
      expect(error).toEqual(new Error('Ooops!'));
    });
    const childCancelablePromise2 = childCancelablePromise.catch((v) => v);
    expect(await childCancelablePromise2).toEqual(new Error('Ooops!'));
  });

  test('it should execute "finally" callback if canceled promise', async () => {
    const promise = new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        topReject(new Error('promise initialization executed'));
        resolve('resolved');
      }).finally((error, val) => {
        topResolve([error, val, 'finally']);
      });
      cancelablePromise.cancel();
    });
    expect(await promise).toEqual([null, undefined, 'finally']);
  });

  /* eslint-disable-next-line */
  test('it should interpreted string as a path if "then" is called with a string', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      resolve({
        name: 'Peter',
        age: 30,
      });
    });
    expect(await cancelablePromise.then('name')).toBe('Peter');
    expect(await cancelablePromise.then('age')).toBe(30);
    expect(await cancelablePromise).toEqual({
      name: 'Peter',
      age: 30,
    });
  });

  /* eslint-disable-next-line */
  test('it should interpreted string as a deep path if "then" is called with a string', async () => {
    const cancelablePromise = CancelablePromise.resolve({
      persons: [
        {name: 'Vasya', age: 40, child: {name: 'Volodya', age: 20}},
        {name: 'Kate', age: 30, child: {name: 'Ann', age: 12}},
      ],
    });
    expect(await cancelablePromise.then('persons.0'))
        .toEqual({name: 'Vasya', age: 40, child: {name: 'Volodya', age: 20}});
    expect(await cancelablePromise.then('persons.0.age')).toBe(40);
    expect(await cancelablePromise.then('persons.1.child'))
        .toEqual({name: 'Ann', age: 12});
    expect(await cancelablePromise.then('persons.1.child.name')).toBe('Ann');
  });

  /* eslint-disable-next-line */
  test('it should return parent value if parent promise "then" is called with empty args', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      resolve({
        name: 'Michael',
        age: 24,
      });
    });
    expect(await cancelablePromise.then()).toEqual({
      name: 'Michael',
      age: 24,
    });
    expect(await cancelablePromise).toEqual({
      name: 'Michael',
      age: 24,
    });
  });

  test('it should never be executed without call "then"', async () => {
    return new Promise((topResolve, topReject) => {
      new CancelablePromise((resolve) => {
        topReject(new Error('promise initialization executed'));
        resolve('resolved');
      });
      setTimeout(topResolve, DEFAULT_TIMEOUT);
    });
  });

  test('it should be executed with call "then"', async () => {
    return new Promise((topResolve) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        topResolve();
        resolve('resolved');
      });
      cancelablePromise.then();
    });
  });

  test('it should defer callback and return cancelable promise', async () => {
    const order = [];
    const cancelablePromise = CancelablePromise
        .defer(() => {
          order.push(2);
          return 'Hello';
        })
        .then((v) => v + ' Vasya!');
    order.push(1);
    expect(await cancelablePromise).toBe('Hello Vasya!');
    expect(order).toEqual([1, 2]);
  });

  test('it should defer callback and cancel it', async () => {
    const order = [];
    CancelablePromise
        .defer(() => {
          order.push(2);
          return 'Hello';
        })
        .then((v) => v + ' Vasya!')
        .cancel();
    order.push(1);
    const promise = new Promise((resolve) => {
      setTimeout(resolve, DEFAULT_TIMEOUT, order);
    });
    expect(await promise).toEqual([1]);
  });

  test('it should delay callback and return cancelable promise', async () => {
    const order = [];
    const cancelablePromise = CancelablePromise
        .delay(100, 'Hi')
        .then((v) => {
          order.push(3);
          return v + ' Peter!';
        });
    order.push(1);
    setTimeout(() => {
      order.push(2);
    }, 50);
    expect(await cancelablePromise).toBe('Hi Peter!');
    expect(order).toEqual([1, 2, 3]);
  });

  test('it should delay callback and cancel it', async () => {
    const order = [];
    CancelablePromise
        .delay(100, 'Hi')
        .then((v) => {
          order.push(3);
          return v + ' Peter!';
        })
        .cancel();
    order.push(1);
    setTimeout(() => {
      order.push(2);
    }, 50);
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 200, order);
    });
    expect(await promise).toEqual([1, 2]);
  });

  test('it should provide new CancelablePromise instance', async () => {
    const cancelablePromise = CancelablePromise.provide((resolve) => {
      resolve('Meow!');
    });
    expect(await cancelablePromise).toBe('Meow!');
  });

  /* eslint-disable-next-line */
  test('it should success call method "all" with array of the promises', async () => {
    const cancelablePromise = CancelablePromise.all([
      CancelablePromise.resolve('Vasya'),
      CancelablePromise.resolve('Volodya'),
      CancelablePromise.resolve('Peter'),
      CancelablePromise.resolve('Samat'),
    ]);
    expect(await cancelablePromise).toEqual([
      'Vasya', 'Volodya', 'Peter', 'Samat',
    ]);
  });

  /* eslint-disable-next-line */
  test('it should success call method "all" with array with any value', async () => {
    const cancelablePromise = CancelablePromise.all([
      'Vasya',
      'Peter',
      CancelablePromise.resolve('Volodya'),
      {name: 'Kate'},
      CancelablePromise.resolve('Samat'),
      321,
    ]);
    expect(await cancelablePromise).toEqual([
      'Vasya', 'Peter', 'Volodya', {name: 'Kate'}, 'Samat', 321,
    ]);
  });

  /* eslint-disable-next-line */
  test('it should success call method "all" with object with any props', async () => {
    const cancelablePromise = CancelablePromise.all({
      name: 'Vasya',
      teeth: 3,
      age: CancelablePromise.resolve(60),
      child: CancelablePromise.resolve({
        name: 'Ann',
      }),
    });
    expect(await cancelablePromise).toEqual({
      name: 'Vasya',
      teeth: 3,
      age: 60,
      child: {
        name: 'Ann',
      },
    });
  });

  test('it should fail if call method "all" with string', async () => {
    const cancelablePromise = CancelablePromise.all('Ooops')
        .catch((e) => 'has error');
    expect(await cancelablePromise).toBe('has error');
  });

  test('it should fail if call method "all" with number', async () => {
    const cancelablePromise = CancelablePromise.all(33)
        .catch((e) => 'has error');
    expect(await cancelablePromise).toBe('has error');
  });

  test('it should fail if call method "all" with null', async () => {
    const cancelablePromise = CancelablePromise.all(null)
        .catch((e) => 'has error');
    expect(await cancelablePromise).toBe('has error');
  });

  test('it should fail if call method "all" with boolean', async () => {
    const cancelablePromise1 = CancelablePromise.all(true)
        .catch((e) => 'has error if true');
    expect(await cancelablePromise1).toBe('has error if true');

    const cancelablePromise2 = CancelablePromise.all(false)
        .catch((e) => 'has error if false');
    expect(await cancelablePromise2).toBe('has error if false');
  });

  /* eslint-disable-next-line */
  test('it should cancel all child promises if cancel aggregate promise which returned by method "all"', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise1 = new CancelablePromise((resolve) => {
        topReject(new Error('promise 1 initialization executed'));
        resolve(1);
      });
      const cancelablePromise2 = new CancelablePromise((resolve) => {
        topReject(new Error('promise 2 initialization executed'));
        resolve(2);
      });
      const cancelablePromise3 = new CancelablePromise((resolve) => {
        topReject(new Error('promise 3 initialization executed'));
        resolve(3);
      });
      const aggregateCancelablePromise = CancelablePromise.all([
        cancelablePromise1,
        cancelablePromise2,
        cancelablePromise3,
      ]).then(() => {
        topReject(new Error('aggregate promise "then" callback executed'));
      });

      aggregateCancelablePromise.cancel();

      setTimeout(topResolve, DEFAULT_TIMEOUT);
    });
  });

  /* eslint-disable-next-line */
  test('it should reject promise which returned by method "all" and cancel others if rejected anyone promises in aggregation', async () => {
    let cancelCount = 0;
    function cancel() {
      cancelCount++;
    }
    const promise = new Promise((topResolve, topReject) => {
      CancelablePromise.all([
        new CancelablePromise((resolve) => {
          setTimeout(resolve, 0, 'one');
          return cancel;
        }),
        CancelablePromise.reject('two'),
        new CancelablePromise((resolve) => {
          setTimeout(resolve, 0, 'three');
          return cancel;
        }),
        new CancelablePromise((resolve) => {
          setTimeout(resolve, 0, 'four');
          return cancel;
        }),
      ]).then(
          () => {
            topReject(new Error('"then" callback executed'));
          },
          topResolve,
          () => {
            topReject(new Error('"then" callback on cancel executed'));
          },
      );
    });
    expect(await promise).toBe('two');
    expect(cancelCount).toBe(3);
  });

  /* eslint-disable-next-line */
  test('it should resolve first value when call "race" with array of the promises', async () => {
    const cancelablePromise = CancelablePromise.race([
      CancelablePromise.delay(200, 'one'),
      CancelablePromise.delay(100, 'two'),
      CancelablePromise.delay(50, 'three'),
      CancelablePromise.delay(500, 'four'),
    ]);
    expect(await cancelablePromise).toBe('three');
  });

  test('"race" with array with any value', async () => {
    const cancelablePromise = CancelablePromise.race([
      'Vasya',
      CancelablePromise.delay(50, 'Pawel'),
      CancelablePromise.delay(500, 'Mary'),
      321,
    ]);
    expect(await cancelablePromise).toBe('Vasya');
  });

  /* eslint-disable-next-line */
  test('"race" if resolved 1 of 4 promises in race then other are cancel', async () => {
    let cancelCount = 0;
    function cancel() {
      cancelCount++;
    }
    const cancelablePromise = CancelablePromise.race([
      new CancelablePromise((resolve) => {
        setTimeout(resolve, 100, 'one');
        return cancel;
      }),
      new CancelablePromise((resolve) => {
        setTimeout(resolve, 100, 'two');
        return cancel;
      }),
      new CancelablePromise((resolve) => {
        setTimeout(resolve, 0, 'three');
        return cancel;
      }),
      new CancelablePromise((resolve) => {
        setTimeout(resolve, 100, 'four');
        return cancel;
      }),
    ]);

    expect(await cancelablePromise).toBe('three');
    expect(cancelCount).toBe(3);
  });

  test('"race" if reject all promises in race', async () => {
    const promise = new Promise((topResolve, topReject) => {
      CancelablePromise.race([
        CancelablePromise.reject('one'),
        CancelablePromise.reject('two'),
        CancelablePromise.reject('three'),
        CancelablePromise.reject('four'),
      ]).then(
          () => {
            topReject(new Error('"then" callback executed'));
          },
          topResolve,
          () => {
            topReject(new Error('"then" callback on cancel executed'));
          },
      );
    });
    expect(await promise).toEqual(['one', 'two', 'three', 'four']);
  });
});
