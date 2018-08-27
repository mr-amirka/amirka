import { Subscription } from 'rxjs';
import { Component, ChangeDetectorRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { localization } from '../../../../../src/services/localization';

@Component({
  selector: "home",
  template: require('./home.route.html')
})
export class HomeRoute implements OnInit, OnDestroy {
	private _subscription: Subscription;
	public locale = localization({
		ru: require('./home.ru.locale.json'),
		en: require('./home.en.locale.json')
	});
	constructor(@Inject(ChangeDetectorRef) private cd: ChangeDetectorRef) {
		
	}
	ngOnInit () {
		this._subscription = this.locale.locale$.subscribe(() => this.cd.detectChanges());
	}
	ngOnDestroy () {
		this._subscription.unsubscribe();
	}
}
