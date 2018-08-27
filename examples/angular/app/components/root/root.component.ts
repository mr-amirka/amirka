import { Component, OnInit } from "@angular/core";
import { localization } from '../../../../../src/services/localization';

@Component({
	selector: "[root]",
 	templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {
	public locale = localization({});
	public constructor() {}

	public setLang(language: string) {
		localization.setLang(language);
	}

	public ngOnInit(): void {

	}
    
}

