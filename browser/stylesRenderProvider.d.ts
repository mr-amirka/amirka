/**
 * @overview styleProvider
 * - предоставляет хранилище стилей
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare namespace stylesRenderProvider {
  export interface style {
    priority?: number;
    name?: string;
    content?: string;
    updated?: boolean;
  }
  export interface stylesRender {
    (styles: style[]): void
  }
}

declare const stylesRenderProvider: (document: Document, prefix?: string) => stylesRenderProvider.stylesRender;
export = stylesRenderProvider;
