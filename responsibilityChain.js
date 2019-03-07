/**
 * @overview responsibilityChain
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (chain, req, end) => {
  const next = (_req, i) => {
    const handler = chain[i];
    if (!handler) return end(_req);
    const ni = i + 1;
    try {
      return handler(_req, req => next(req || _req, ni));
    } catch (ex) {
      console.error(ex);
      return next(_req, ni);
    }
  };
  return next(req, 0);
};
