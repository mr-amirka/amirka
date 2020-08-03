const crypto = require('crypto');
const uniqIdProvider = require('mn-utils/uniqIdProvider');
const time = require('mn-utils/time');
const isString = require('mn-utils/isString');
const cacheProvider = require('mn-services/cacheProvider');
const { encrypt, decrypt } = require('mn-back-utils/crypto');



const sha512 = (text) => {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  return hash.digest('hex');
};

const MINUTE = 1000 * 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const defaultOptions = {
  tokenKey: 'host-token',
  expires: 7 * DAY,
  expiresJWT: 15 * MINUTE,
  expiresCookie: 360 * DAY,
  secret: 'password1'
};

const tokenKey = 'host-token';
module.exports = (options) => {
  const _options = {
    ...defaultOptions,
    ...options
  };

  const {
    secret,
    expires,
    expiresJWT,
    expiresCookie
  } = _options;

  const getSessionId = uniqIdProvider();
  const cache = cacheProvider(expires);


  const getSession = (token) => {
    if (!isString(token)) return;
    const [ id, confirmToken ] = token.split('|');
    let session = cache.get(id);
    if (!session) return;
    if (session.token === confirmToken) return session;
    cache.set(id, null);
  };

  const sessionHandle = (token, updateToken) => {
    let session = getSession(token);

    console.log({ token });

    if (session) return session;

    const prefix = '' + getSessionId() + '|';
    const id = sha512(prefix + Math.random());
    const confirmToken = sha512(prefix + Math.random());
    cache.set(id, session = {
      createdon: time(),
      token: confirmToken,
      data: {}
    });
    updateToken(id + '|' + confirmToken);
    return session;
  };



  return async (ctx, next) => {
    const cookies = ctx.cookies;
    const session = ctx.session = sessionHandle(cookies.get(tokenKey), (token) => {
      cookies.set(tokenKey, token, {
        httpOnly: true,
        expires: new Date(time() + expiresCookie)
      });
    });
    return next();
  };
};



/*
const jwt = require('jsonwebtoken');
const uniqIdProvider = require('mn-utils/uniq-id-provider');
const time = require('mn-utils/time');

const defaultOptions = {
  tokenKey: 'host-token',
  expires: 1000 * 3600 * 24,
  secret: 'password1'
};

const tokenKey = 'host-token';
module.exports = (options) => {
  const _options = {
    ...defaultOptions,
    ...options
  };

  const { secret, expires } = _options;

  const getSessionId = uniqIdProvider();

  return async (ctx, next) => {
    const cookies = ctx.cookies;
    const token = cookies.get(tokenKey);

    console.log({ token });

    let sessionData = token ? (await (new Promise((resolve) => {
      jwt.verify(token, secret, (err, decoded) => {
        console.log({ err,  decoded })
        resolve(err ? null : decoded);
      });
    }))) : null;

    let changed;
    const expiresEnd = time() + expires;
    if (!sessionData) {
      changed = true;
      sessionData = {
        expires: expiresEnd,
        id: getSessionId()
      };
    }

    ctx.session = {
      get: () => sessionData,
      set: (data) => {
        changed = true;
        sessionData = data;
      }
    };

    await next();

    changed && cookies.set(tokenKey, jwt.sign(sessionData, secret), {
      httpOnly: true,
      expires: new Date(expiresEnd)
    });
  };
};
*/



/*
const uniqIdProvider = require('mn-utils/uniq-id-provider');
const time = require('mn-utils/time');
const cacheProvider = require('mn-services/cache-provider');

const sha512 = require('js-sha512');

const defaultOptions = {
  tokenKey: 'host-token',
  expires: 1000 * 3600 * 24,
  encryptionKey: 'password1',
  encryptionConfirmKey: 'password2',
};

const tokenKey = 'host-token';
module.exports = (options) => {
  const _options = {
    ...defaultOptions,
    ...options
  };

  const getSessionId = uniqIdProvider();
  const cache = cacheProvider();

  const getSessionToken = () => {
    const id = getSessionId();
    const token = [ id, sha512([ id, time(), Math.random() ].join('|')) ].join('|');
    cache.set(id, {
      token
    });
    return token;
  };



  return async (ctx, next) => {
    let token = ctx.cookies.get(tokenKey);
    console.log({ token });




    ctx.cookies.set(tokenKey, getSessionToken());

    return next();
  };
};
*/
