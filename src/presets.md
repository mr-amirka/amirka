[Русский](https://github.com/mr-amirka/amirka/blob/master/src/presets-ru.md)


# Minimalist Notation Default Presets


#### Библиотека MN включает в себя предустановленные настройки включенные в cli-версию по-умолчанию.

#### Медиа-запросы (amirka/mn-presets/mn.medias.js):

| Media name | Priority | Media-query                                 |
| ---------- | -------- | ------------------------------------------- |
| sm         | 0        | (max-width: 991px)                          |
| sm-md      | 1        | (min-width: 768px) and (max-width: 991px)   |
| xs         | 2        | (max-width: 767px)                          |
| xs-sm      | 3        | (min-width: 480px) and (max-width: 767px)   |
| xv         | 4        | (max-width: 639px)                          |
| xm         | 5        | (max-width: 479px)                          |
| xm-xs      | 6        | (min-width: 360px) and (max-width: 479px)   |
| mm         | 7        | (max-width: 359px)                          |
| md         | 8        | (min-width: 992px)                          |
| md-lg      | 9        | (min-width: 992px) and (max-width: 1199px)  |
| lg         | 10       | (min-width: 1200px)                         |
| lg-ll      | 11       | (min-width: 1200px) and (max-width: 1559px) |
| ll         | 12       | (min-width: 1600px)                         |
| pt         | 13       | print                                       |


**Example:**  


Input:  
```html
<div m="ph15 ph10@sm">...</div>
```
Output:  
```css
[m~='ph15']{
  padding-left: 15px;
  padding-right: 15px;
}
@media (max-width: 991px) {
  [m~='ph10']{
    padding-left: 10px;
    padding-right: 10px;
  }
}
```


#### Состояния (amirka/mn-presets/mn.states.js):

| State name | Selectors                                        |
| ---------- | ------------------------------------------------ |
| h          | :hover                                           |
| a          | :active                                          |
| f          | :focus                                           |
| i          | ::-webkit-input-placeholder, ::-moz-placeholder, :-ms-input-placeholder, ::placeholder  |
| even       | :nth-child(2n)                                   |
| odd        | :nth-child(2n+1)                                 |
| even       | :nth-child(2n)                                   |
| n          | :nth-child                                       |
| first      | :first-child                                     |
| last       | :last-child                                      |


**Example:**  


Input:  
```html
<a m="o70:h">link</a>
```
Output:  
```css
[m~='o70:h']:hover {
  opacity: 0.7;
}
```


#### Прочие настройки по умолчанию (amirka/mn-presets/mn.theme.js):

```js
mn.css({
  '*, *:before, *:after': {
    boxSizing: 'border-box'
  },
  html: {
    '-ms-text-size-adjust': '100%',
    '-webkit-text-size-adjust': '100%',
    '-webkit-tap-highlight-color': '#000'
  }
});

mn.assign({
  body: 'm0'
});
```


#### Именование сторон в имени эссенции, если такое уточнение может иметь место для рассматриваемого атрибута


Base format: {baseAttrName}{sideName}{value}

| Side suffix | Sides         | Description |
| ----------- | ------------- | ----------- |
| t           | top           |             |
| b           | bottom        |             |
| l           | left          |             |
| r           | right         |             |
| v           | top, bottom   | vertical    |
| h           | left, right   | horizontal  |
| lt          | left, top     |             |
| rt          | right, bottom |             |
| lb          | left, bottom  |             |
| rb          | right, bottom |             |


**Examples:**  

```html
<div m="p5"></div>
```
```css
[m~="p5"]{
  padding: 5px;
}
```


```html
<div m="pl10"></div>
```
```css
[m~="pl10"]{
  padding-left: 10px;
}
```




```html
<div m="pv15"></div>
```
```css
[m~="pv15"]{
  padding-top: 15px;
  padding-bottom: 15px;
}
```




```html
<div m="prb15"></div>
```
```css
[m~="prb15"]{
  padding-right: 15px;
  padding-bottom: 15px;
}
```





#### Эссенции стилей (amirka/mn-presets/mn.styles.js):

**Dynamic essences:**


| Essence name | Style attrubute name    | Description | Value format                   | Default       |
| ----------- | ------------------------ | ----------- | ------------------------------ | ------------- |
| p           | padding                  |             | {side:lowerCase}{number}{unit} | 0px           |
| m           | margin                   |             | {side:lowerCase}{number}{unit} | 0px           |
| pn          | top, bottom, left, right | position    | {side:lowerCase}{number}{unit} | 0px           |
| b           | border-width             |             | {side:lowerCase}{number}{unit} | 0px           |
| bs          | border-style             |             | {camleCase}                    |               |
| bc          | border-color             |             | {camleCase/([A-F0-9]+)}        | #000          |
| sq          | width, height            | square      | {number}{unit}                 | 100%, 100%    |
| w           | width                    |             | {number}{unit}                 | 100%          |
| h           | height                   |             | {number}{unit}                 | 100%          |
| sqmin       | min-width, min-height    | square      | {number}{unit}                 | 100%, 100%    |
| wmin        | min-width                |             | {number}{unit}                 | 100%          |
| hmin        | min-height               |             | {number}{unit}                 | 100%          |
| sqmax       | max-width, max-height    | square      | {number}{unit}                 | 100%, 100%    |
| wmax        | max-width                |             | {number}{unit}                 | 100%          |
| hmax        | max-height               |             | {number}{unit}                 | 100%          |
| dn          | transition-duration      |             | {number(ms)}                   | 250ms         |
| c           | color                    |             | {camleCase/([A-F0-9]+)}        | #000          |
| stroke      | stroke                   |             | {camleCase/([A-F0-9]+)}        | #000          |
| bg          | background               |             | {camleCase/([A-F0-9]+)}[ ...-{camleCase/([A-F0-9]+)} ] | #000          |
| x           | transform: translate({x}, {y}) scale({s}) |             | {number}{%}y{number}{%}s{number(*0.01)} | 0, 0, none    |
| spnr        | animation: spinner-animate {speed} ms infinite linear | spiner      | {number(ms)}                   | 3000          |
| rx          | transform: rotateX({v})  |             | {number(deg)}                  | 180           |
| ry          | transform: rotateY({v})  |             | {number(deg)}                  | 180           |
| rz          | transform: rotateZ({v})  |             | {number(deg)}                  | 180           |
| sh          | box-shadow               | shadow      | {number(px)}r{number(px)}x{number(px)}y{number(px)}m{number(repeat)}c{([A-F0-9]+)}{in} | 0, 0, 0, 0, 1, #000, none |
| tsh         | text-shadow              | text-shadow | {number(px)}x{number(px)}y{number(px)}m{number(repeat)}c{([A-F0-9]+)}{in} | 0, 0, 0, 1, #000, none |
| f           | font-size                | font        | {number}{unit}                 | 180           |
| fw          | font-weight              |             | {camleCase/number(*100)}       | 14px          |
| ff          | font-family              |             | {snackCase}                    |               |
| fs          | font-style               |             | {camelCase}                    |               |
| r           | border-radius            | radius      | {number}{unit}                 | 10000px       |
| z           | z-index                  |             | {number}                       | 1             |
| o           | opacity                  |             | {number(*0.01)}                | 0             |
| lh          | line-height              |             | {number}{unit}                 | 1             |
| tn          | transition               |             | {snackCase}                    |               |
| g           | grid-template            |             | {snackCase}                    |               |
| gr          | grid-template-rows       |             | {snackCase}                    |               |
| gc          | grid-template-columns    |             | {snackCase}                    |               |
| gar         | grid-auto-rows           |             | {snackCase}                    |               |
| gg          | grid-gap                 |             | {snackCase}                    |               |
| gRow        | grid-row                 |             | {snackCase}                    |               |
| gCol        | grid-column              |             | {snackCase}                    |               |
| fx          | flex                     |             | {snackCase}                    |               |
| tp          | transition-property      |             | {snackCase}                    |               |
| ctt         | content                  |             | {snackCase}                    | none          |
| rs          | border-radius            | radius      | {snackCase}                    |               |
| ov          | overflow                 |             | {camelCase}                    |               |
| ovx         | overflow-x               |             | {camelCase}                    |               |
| ovy         | overflow-y               |             | {camelCase}                    |               |
| fd          | flex-direction           |             | {camelCase}                    |               |
| jc          | justify-content          |             | {camelCase}                    |               |
| ai          | align-items              |             | {camelCase}                    |               |
| tt          | text-transform           |             | {camelCase}                    |               |
| td          | text-decoration          |             | {camelCase}                    |               |
| to          | text-overflow            |             | {camelCase}                    |               |
| cr          | cursor                   |             | {camelCase}                    |               |
| ol          | outline                  |             | {camelCase}                    |               |
| ws          | white-space              |             | {camelCase}                    |               |
| va          | vertical-align           |             | {camelCase}                    |               |
| d           | display                  |             | {camelCase}                    |               |
| e           | pointer-events           |             | {camelCase}                    |               |
| us          | user-select              |             | {camelCase}                    |               |
| v           | visibility               |             | {camelCase}                    |               |
| col         | width                    | column      | {number(*100%)}/{number}       | (12, 12) 100% |
| blur        | filter: blur({v}px)      |             | {number}                       | 4             |
| ratio       | &{position: relative; padding-top: calc({h}/{w}% + {add}px)} &>*{position: absolute; top: 0; bottom: 0; left: 0; right: 0} |             | {number}x{number}[-+]{number} | (1, 1, 0) 100% |






**Static essences:**  

| Essence name  | css                                                                | Description           |
| ------------- | ------------------------------------------------------------------ | --------------------- |
| tbl           | &{display: table} &>*{display: table-cell; vertical-align: middle} |                       |
| tbl           | &{display: table} &>*{display: table-cell; vertical-align: middle} |                       |
| layout        | &{display: [ -webkit-box, -webkit-flex, flex ]}                    |                       |
| layoutRow     | &{exts layout; box-direction: normal; box-orient: horizontal; flex-direction: row; box-pack: start; justify-content: flex-start; box-align: center; align-items: center; align-content: center} |                       |
| layoutColumn  | &{exts layout; box-direction: normal; box-orient: vertical; flex-direction: column} |                       |
| fhaStart      | &{box-pack: start; justify-content: flex-start}                    | flex horizontal align |
| fhaCenter     | &{box-pack: center; justify-content: center}                       | flex horizontal align |
| fhaEnd        | &{box-pack: end; justify-content: flex-end}                        | flex horizontal align |
| fhaAround     | &{box-pack: space-around; justify-content: space-around}           | flex horizontal align |
| fhaBetween    | &{box-pack: justify; justify-content: space-between}               | flex horizontal align |
| fvaStart      | &{box-align: start; align-items: flex-start; align-content: flex-start} | flex vertical align   |
| fvaCenter     | &{box-align: center; align-items: center; align-content: center}   | flex vertical align   |
| fvaEnd        | &{box-align: end; align-items: flex-end; align-content: flex-end}  | flex vertical align   |
| fvaStretch    | &{box-align: stretch; align-items: stretch; align-content: stretch} | flex vertical align   |
| tl            | &{text-align: left}                                                | text-left             |
| tc            | &{text-align: center}                                              | text-center           |
| tr            | &{text-align: right}                                               | text-right            |
| tj            | &{text-align: justify}                                             | text-justify          |
| lt            | &{float: left}                                                     | left                  |
| rt            | &{float: right}                                                    | right                 |
| jt            | &{float: none}                                                     | justify               |
| overlay       | &{position: absolute; top: 0; left: 0; right: 0; bottom: 0}        |                       |
| rlv           | &{position: relative}                                              | relative              |
| fixed         | &{position: fixed}                                                 | fixed                 |
| abs           | &{position: absolute}                                              | absolute              |
| static        | &{position: static}                                                | static                |
| st            | &{top: 0; left: 0; right: 0}                                       | side-top              |
| sb            | &{bottom: 0; left: 0; right: 0}                                    | side-bottom           |
| sl            | &{top: 0; left: 0; bottom: 0}                                      | side-left             |
| sr            | &{top: 0; right: 0; bottom: 0}                                     | side-right            |
| slt           | &{left: 0; top: 0;}                                                | side-left-top         |
| slb           | &{left: 0; bottom: 0}                                              | side-left-bottom      |
| srt           | &{right: 0; top: 0;}                                               | side-right-top        |
| srb           | &{right: 0; bottom: 0}                                             | side-right-bottom     |
| break         | &{white-space: normal; word-break: break-word}                     |                       |





## Links



Try this test: https://jsfiddle.net/j6d8aozy/46/

Home page: http://minimalist-notation.org

[Getting started](https://github.com/mr-amirka/amirka/blob/master/README.md)

[Подробная документация](https://github.com/mr-amirka/amirka/blob/master/src/README.md)

[От автора](https://github.com/mr-amirka/amirka/blob/master/src/from-author.md)




Буду благодарен за Ваши отзывы и замечания. Пишите мне в [telegram](https://t.me/mr_amirka) .  
С любовью, Ваш mr.Amirka :)



Вы заинтересованы в развитии проекта? Внесите свою [лепту](https://yasobe.ru/na/notation)
