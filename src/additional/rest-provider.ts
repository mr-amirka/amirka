
import {RequestOptions} from './request';
import {Deal} from '../base/deal';
import {Http} from './http-provider';

interface where {
	(query: any): Deal;
}
interface post {
	(body: any): Deal;
}
interface put {
	(body: any, query: any): Deal;
}

export interface Rest {
	post: post;
	put: put;
	get: where;
	delete: where;
}

export const restProvider = (http: Http, essenceName: string): Rest => {
	return {
		post: (body: any) => http.post(essenceName, { body }),
		put: (body: any, query: any) => http.put(essenceName, { body, query }),
		get: (query: any) => http.get(essenceName, { query }),
		delete: (query: any) => http.delete(essenceName, { query })
	};
}
