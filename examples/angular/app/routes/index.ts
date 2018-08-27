/**
 * @overview app states
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { Injector } from '@angular/core';
import { UIRouterModule, UIRouter } from "@uirouter/angular";

//ROUTES
import { HomeRoute } from './home/home.route';


const states = [
	{
		name: 'home',
		url: '',
		component: HomeRoute
	}
];

export const ROUTES_DECLARATIONS = states.map(state => state.component);
export const RouterModule = UIRouterModule.forRoot({ 
  states, 
  useHash: true,
  config(router: UIRouter, injector: Injector) {
    /*
    const peopleService = injector.get(PeopleService); 
    // Pre-load the people list at startup.
    peopleService.getAllPeople();
    */
    
    // If no URL matches, go to the `hello` state by default
    router.urlService.rules.otherwise({ state: 'home' });
  }
});