const aggregate = require('./aggregate');

describe('aggregate', () => {
  test('it should aggregate functions array into one function', async () => {
    const outputs = [];
    const aggregateFn = aggregate([
      (a, b) => {
        outputs.push(a + b);
      },
      (a, b) => {
        outputs.push(a * b);
      },
      (a, b) => {
        outputs.push(a - b);
      },
      (a, b) => {
        outputs.push(b - a);
      },
    ]);

    expect(outputs).toEqual([]);
    aggregateFn(5, 7);
    expect(outputs).toEqual([12, 35, -2, 2]);
  });
});
