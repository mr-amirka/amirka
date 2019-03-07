
module.exports = (text, limit, suffix) => {
  limit || (limit = 12);
  const _text = (text === undefined || text === null ? '' : ('' + text));
  const length = _text.length;
  console.log({
    length,
    limit
  });
  return length > limit ? (_text.substr(0, limit) + (suffix || '...')) : _text;
};
