const re = /-/;
module.exports = (v) => {
  const words = v.split(re);
  const length = words.length;
  for (let i = 1, word; i < length; i++) {
    words[i] = (word = words[i]).substr(0, 1).toUpperCase() + word.substr(1);
  }
  return words.join('');
};
