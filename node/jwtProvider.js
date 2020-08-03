const {encrypt, decrypt} = require('./crypto');
const hash = require('./hash');

const bufferFrom = Buffer.from;
const jsonStringify = JSON.stringify;
const jsonParse = JSON.parse;

const defaultOptions = {
  secret: 'password1',
  hashType: 'sha256'
};

function handleError(ex) {
  console.error(ex);
  return null;
}

module.exports = (options) => {
  const {secret, hashType, expires} = {
    ...defaultOptions,
    ...options
  };

  return {
    encode: async (body, header) => {
      const src
        = bufferFrom(jsonStringify(header || {}), 'utf8').toString('base64')
        + '.' + bufferFrom(jsonStringify(body), 'utf8').toString('base64')
      return encrypt(src + '.' + hash(src, hashType), secret);
    },
    decode: async (input) => {
      if (typeof input !== 'string') return;
      const decrypted = await decrypt(input, secret)
          .catch(handleError);

      if (!decrypted) return;

      const parts = decrypted.split('.');
      if (parts.length !== 3) return;

      const [base64Header, base64Body, hashValue] = parts;

      if (!hashValue || hash(base64Header + '.' + base64Body, hashType) !== hashValue) return

      let body, header;
      try {
        header = jsonParse(bufferFrom(base64Header, 'base64').toString('utf8'));
        body = jsonParse(bufferFrom(base64Body, 'base64').toString('utf8'));
      } catch (ex) {
        return;
      }

      return {
        header,
        body
      };
    }
  };
};
