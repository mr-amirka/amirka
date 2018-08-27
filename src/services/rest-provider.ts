
import { Deal } from '../base/deal';
import { Http } from './http-provider';


export interface Rest {
	post: (body: any) => Deal;
	put: (body: any, where: any) => Deal;
	get: (where: any, limit?: number, offset?: number) => Deal;
	delete: (where: any) => Deal;
}

export const restProvider = (http: Http, essenceName: string): Rest => {
	return {
		post: (body: any) => http.post(essenceName, { body }),
		put: (body: any, where: any) => http.put(essenceName, { 
			body,
			query: { where }
		}),
		get: (where: any, limit?: number, offset?: number) => http.get(essenceName, { 
			query: {
				where: where || {},
				offset: offset || 0,
				limit: limit || 100
			}
		}),
		delete: (where: any) => http.delete(essenceName, { 
			query: { where } 
		})
	};
}
