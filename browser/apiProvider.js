const forIn = require('../forIn');
const forEach = require('../forEach');
const emitterProvider = require('../emitterProvider');

module.exports = ({request, essences, customs, keyValues}) => {
  const errors$ = emitterProvider([]);
  const error$ = errors$.map((items) => items && items[0]);

  const loading$ = emitterProvider(0);

  const apiRequest = (methodName, options) => {
    loading$.calc(1);
    return request(methodName, options).then((response) => {
      if (response.error) throw response;
      return response && response.data;
    }).catch((error) => {
      const data = {methodName, options, error};
      errors$.emit([
        ...errors$.getValue(),
        data,
      ]);
      console.error(data);
      throw error;
    }).finally(() => {
      loading$.calc(-1);
    });
  };

  const requestWrapper = (apiRequest) => {
    const method = (...args) => {
      loading$.calc(1);
      return apiRequest(...args).finally(() => {
        loading$.calc(-1);
      });
    };
    const loading$ = method.loading$ = emitterProvider(0);
    return method;
  };

  const api = {};

  forEach(keyValues, (instanceName) => {
    api[instanceName] = {
      set: requestWrapper((key, value, options) => {
        return apiRequest(instanceName, {
          method: 'PUT',
          body: {...options, key, value},
        });
      }),
      get: requestWrapper((key, options) => {
        return apiRequest(instanceName, {
          method: 'GET',
          query: {...options, key},
        });
      }),
    };
  });

  forIn(customs, (methods, instanceName) => {
    const instance = api[instanceName] = {};
    forEach(methods.post, (methodName) => {
      instance[methodName] = requestWrapper((body) => {
        return apiRequest(instanceName + '.' + methodName, {
          method: 'POST',
          body,
        });
      });
    });
    forEach(methods.get, (methodName) => {
      instance[methodName] = requestWrapper((query) => {
        return apiRequest(instanceName + '.' + methodName, {
          method: 'GET',
          query,
        });
      });
    });
  });

  forEach(essences, (essenceName) => {
    api[essenceName] = {
      send: requestWrapper((data) => {
        return apiRequest(essenceName, {
          method: 'POST',
          body: {data},
        });
      }),
      edit: requestWrapper((data, where) => {
        return apiRequest(essenceName, {
          method: 'PUT',
          body: {data, where},
        });
      }),
      get: requestWrapper((where, limit, offset) => {
        return apiRequest(essenceName, {
          method: 'GET',
          query: {where, limit, offset},
        });
      }),
      remove: requestWrapper((where) => {
        return apiRequest(essenceName, {
          method: 'DELETE',
          body: {where},
        });
      }),
    };
  });

  return {
    errors$,
    error$,
    loading$,
    request: apiRequest,
    api,
  };
};
