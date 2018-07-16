import {Deal} from './deal';

let deal = (new Deal((resolve, rejected, progress) => {
  let loaded = 0;
  let total = 5;
  let stop: boolean;
  function step() {
    setTimeout(() => {
      if (stop) return;
      loaded++;
      progress({loaded, total});
      if (loaded < total) return step();
      resolve('Finish!');
    }, 500);
  }
  step();
  return () => {
    stop = true;
  };
})).progress((event) => {
  console.log('progress', event);
}).then((value) => {
  console.log('then value', value);
  return value;
}, (err) => {
  console.log('then catch', err);
  return Deal.reject(err);
}, (event) => {
  console.log('then progress', event);
}).catch((err) => {
  console.log('catch', err);
  return Deal.reject(err);
}).finally((err, value) => {
  console.log('finally',err, value);
});

setTimeout(() => {
  deal.cancel();
  console.log('cancel');
}, 1500);
