/**
 * @overview CodeDirective
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {Directive, ElementRef, OnInit, Inject, Input } from '@angular/core';

import 'highlight-ts/styles/monokai-sublime.css';

import {
  Options,
  Highlighter,
 
  // import basic APIs
  registerLanguages,
  htmlRender,
  init,
  process,

  // import preferred languages
  CPlusPlus,
  TypeScript,
  JavaScript,
  Python,
  SCSS,
  Rust,
  PHP,
  XML,
  SQL
} from 'highlight-ts/src/highlight';
 
// register languages
registerLanguages(
  PHP,
  XML,
  SQL,
	Rust,
	SCSS,
  CPlusPlus,
  TypeScript,
  JavaScript,
  Python
);

const options: Options = {
	tabReplace: '  ',
  classPrefix: 'hljs-',
  useBr: true
  /* other options */
};
const highlighter: Highlighter<string> = init(htmlRender, options);
const languages = ['ts', 'js', 'rust', 'python', 'scss', 'xml', 'php', 'sql', 'c++'];


@Directive({
  selector: '[code]'
})
export class CodeDirective implements OnInit {
	@Input() code: string | string[] = '';

  constructor(@Inject(ElementRef) private el: ElementRef) { }

  ngOnInit(): void {
    const self = this;
    const lang = self.code || languages;
  	const el = self.el.nativeElement;
  	let source = el.innerHTML.trim();
    const matchs = /^.*?\n(\s+)(.*)$/.exec(source);
    const space = matchs && matchs[1] || '';
    if (space) source = source.replace(new RegExp(space, 'gm'), '');
    el.innerHTML = process(highlighter, source, lang).value;
  }

}