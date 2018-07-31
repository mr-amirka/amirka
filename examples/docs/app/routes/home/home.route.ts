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

/*

{
	"about": "<x><b>Minimalist Notation (MN)</b> is a technology for generating styles based on parsing markup.</x><x>In the current version for web applications, the generation is done directly in the CSS.</x><x>Technology tremendously speeds up the layout process and can be used additionally with traditional technologies, or replace them completely.</x><x>The advantage over the traditional technologies of CSS-preprocessing is that the developer gets rid of the need to write CSS. CSS is generated automatically based on the notation and  the style generate rules specified by the developer.</x><x>The developer no longer needs to control which styles are used in his markup and which ones are not, for from now on the styles are generated dynamically only for what is present in the markup.</x>"
}

{
	"language": "язык",
	"about": "<x><b>Minimalist Notation (MN) (минималистическая нотация)</b> - это технология генерации стилей, основанная на парсинге разметки.</x><x>В текущей версии для веб-приложений генерация осуществляется непосредственно в СSS.</x><x>Технология колоссально ускоряет процесс верстки и может использоваться дополнительно с традиционными технологиями, либо заменять их полностью.</x><x>Преимущество перед традиционными технологиями CSS-препроцессинга в том, что разработчик избавляется от необходимости писать CSS. CSS генерируется автоматически на основании нотации и заданных разработчиком правил генерации стилей. </x><x>Разработчику больше не нужно контролировать, какие стили используются в его разметке, а какие - нет, ибо отныне стили генерируются динамически только для того, что присутствует в разметке.</x>"
}

*/