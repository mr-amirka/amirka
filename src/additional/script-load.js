/**
 * @overview scriptLoad
 * Простой загрузчик скриптов
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const scriptLoad = (url, options) => {
	const type = typeof options;
	let onSuccess, onError, onComplete, onProgress;

	if (type === 'object') {
		onSuccess = options.success;
		onError = options.error;
		onComplete = options.complete;
		onProgress = options.progress;
	} else {
		if (type === 'function') {
			onComplete = options;
		}
	}

	const script = document.createElement('script');
  const head = document.getElementsByTagName('head')[0];
  let success = true;

  const execute = script.onload = once(() => {
    setTimeout(remove, 10);
   	const status = script.status || (success ? 200 : 404);
    if(status > 199 && status < 400) {
    	onSuccess && onSuccess();
    } else {
    	errorEmit(success, status)
    }
    onComplete && onComplete(success, status);
  });

  const errorEmit = script.onerror = once(err => {
  	setTimeout(remove, 10);
    success = false;
    onError && onError();
  });

 	script.onreadystatechange = () => regexpLoaded.exec(script.readyState) && execute();

 	const remove = once(() => head.removeChild(script));

 	onProgress && (script.onprogress = onProgress);
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.async = true;
  script.src = url;
  
  head.appendChild(script);
};

const regexpLoaded = /complete|loaded/i;
const once = (cb) => {
	let result;
	return function () {
		if (cb) {
			result = cb.apply(this, arguments);
			cb = null;
		}
		return result;
	};
};