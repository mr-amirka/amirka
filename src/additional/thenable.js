/**
 * @overview thenable
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */


export const thenable = (executor) => {
	let pool = [];
	let subject;
	const done = (_subject) => {
		subject = _subject;
		const _pool = pool;
		pool = null;
		const length = _pool.length;
		for (let i = 0; i < length; i++) {
			execute(_pool[i], _subject);
		}
	};
	executor ? executor(done) : done();
	return {
		then(cb) {
			return thenable((_done) => {
				const _execute = (subject) => _done(cb(subject));
				if (pool) {
					pool.push(_execute);
				} else {
					cb(_subject);
				}	
			});
		}
	};
};

const execute = (cb, subject) => {
	try {
		cb(subject);
	} catch (ex) {
		console.error(ex);
	}
};