# Amirka: MinimalistNotation и прочие инструменты
  

Буду благодарен за Ваши отзывы и замечания. Пишите мне в telegram https://t.me/mr_amirka .  
С любовью, Ваш mr.Amirka :)
  

При необходимости Вы можете имортировать только нужные Вам файлы библиотеки.  


Библиотека Amirka включает в себя:  
- Minimalist Notation (технология, оптимизирующая процесс верстки);  
- Deal (Отменяемый Promise c имплементацией методов: finally, cancel и progress);  
- прочие сомнительные штуки...:)  


### Почему всё находится в одной библиотеке?

1. Все функции находятся в составе одной библиотеки, потому как в ней многократно переиспользуются собственные функции.  

2. Мне было довольно быстро и легко разрабатывать и перерабатывать все эти функции в рамках одного проекта и одной экосистемы.  

3. Я сторонник такого подхода, в котором весь исходный код проекта опирается на единую фундаментальную базу. При таком подходе легче ориентироваться, и он не содержит в себе дублирующуюся имплементацию методов схожих по назначению в каждом отдельном автономном компоненте, увеличивающую суммарный объем исходного кода.




## Minimalist Notation.

Minimalist Notation (MN) (минималистическая нотация) - это технология генерации стилей, основанная на парсинге разметки. В текущей версии для веб-приложений генерация осуществляется непосредственно в СSS. Технология колоссально ускоряет процесс верстки и может использоваться дополнительно с традиционными технологиями, либо заменять их полностью.  

Преимущество перед традиционными технологиями CSS-препроцессинга в том, что разработчик избавляется от необходимости писать CSS. CSS генерируется автоматически на основании нотации и заданных разработчиком правил генерации стилей. Разработчику больше не нужно контролировать, какие стили используются в его разметке, а какие - нет, ибо отныне стили генерируются динамически только для того, что присутствует в разметке. 


Demo page: https://dartline.ru/minimalist-notation

Try this test: https://jsfiddle.net/j6d8aozy/44/

Home page: http://minimalist-notation.org


PS:   
Технология ориентирована на методологию Functional/Atomic CSS - не так давно меня просветили в теории.  
Валерий, СПАСИБО!  

По названию методологии намониторил подобные проекты: https://acss.io/ , https://www.npmjs.com/package/functional-css


PS: Если Вы верстаете по методологии Functional/Atomic CSS, то: 
* со временем Вы с первого взгляда понимаете смысл каждого имени в разметке;
* имеете возможность легко стандартизировать правила нотации и именования;
* разметку легко переиспользовать в новом проекте, если он предусматривает тот же базовый набор функциональных стилей в CSS. 
* в случае внесения правок в дизайн, Вы будете менять разметку HTML, внося минимум правок в CSS.
* у Вас прямые руки - Вы не натыкаетесь на грабли с перекрытиями стилей;
* имеете возможность настроить Вашу систему сборки под автоматическую генерацию CSS из атрибутов в разметке;
* не задаете громоздкие атрибуты длинным селекторам в каждом месте, где хотите, например, просто добавить плавность трансформации. В функциональном подходе это делается один раз, как в CSS-коде ниже:

```css
[m~='dn250'] {
  -khtml-transition-duration: 250ms !important;
  -ms-transition-duration: 250ms !important;
  -o-transition-duration: 250ms !important;
  -moz-transition-duration: 250ms !important;
  -webkit-transition-duration: 250ms !important;
  transition-duration: 250ms !important;
}
```   



PS: Если у Вас вызывает беспокойство, почему некоторые атрибуты имеют флаг ``` !important ```, то это обусловлено тем, что атомные стили должны быть более приоритетными, чем традиционные классы и сложные селекторы, так как применение атомных стилей подразумевает более точечную кастомизацию разметки поверх других более общих правил CSS. Например, во флаге ``` !important ``` была необходимость когда я применял технологию ``` MN ``` вместе с ``` Angular Material (MD) ``` для корректировки и кастомизации внешнего вида некоторых элементов, так как стили комплексных селекторов из MD перекрывали стили MN. Однако такой подход может создавать Вам грабли, если Вы захотите посредством JS динамически менять стиль элемента, на который распространяется действие флага ``` !important ``` из CSS. Поэтому этот нюанс стоит учитывать. Например, это предусмотрено в некоторых дефолтных правилах MN генерации эссенций стилей. Вы можете добавить суффикс ``` -i ``` в конец имени эссенции:  
```css
[m~='dn250-i'] {
  -khtml-transition-duration: 250ms;
  -ms-transition-duration: 250ms;
  -o-transition-duration: 250ms;
  -moz-transition-duration: 250ms;
  -webkit-transition-duration: 250ms;
  transition-duration: 250ms;
}
```



Благодаря MN:
* СSS генерируется автоматически из значений атрибутов в разметке, и мы экономим время, избавив себя от написания "сатанинского" CSS-кода;
* у нас нет мертвого CSS-кода, ибо CSS генерируется только для той разметки, которая имеется.
* мы имеем возможность не обращаться на сервер за "тяжелыми" СSS-файлами, генерируя CSS в рантайме.
* при внесении правок в дизайн мы меняем только разметку HTML, не трогая СSS. 

Если же Вы хотите иметь возможность кастомизировать / менять тему Вашего приложения, подменяя один только CSS-файл, то ничто не мешает Вам делать это по методологии BEM naming convention, ограничиваясь кастомизаций цветовых схем, размеров шрифтов и прочих атрибутов, не требующих изменения самой разметки.  

Для целей кастомизации стилей разметки под определенную тему в MN предусмотрена возможность манипуляции глобальными CSS правилами в рантайме, например, так с конкретными селекторами:
```js
mn.css('.bgTheme', {
  backgroundColor: '#EEE'
});
mn.css('.bTheme', {
  borderColor: '#CCC'
});
```
или так с эссенциями:
```js
mn('bgTheme', {
  style: {
    backgroundColor: '#EEE'
  }
});
mn('bTheme', {
  style: {
    borderColor: '#CCC'
  }
});
```

PS: Если необходимо задать несколько альтернативных значений для одного атрибута по аналогии с оным в CSS:
```css
.theme-bg{
  background-color: #CCC;
  background-color: rgba(0,0,0,0.2);
}
```
Вы можете сделать так:
```js
mn.css('.theme-bg', {
  backgroundColor: [ '#CCC',  'rgba(0,0,0,0.2)' ]
});
```


Технология "Minimalist Notation" поддерживает:
* параметризуемую нотацию имен
* параметризуемые состояния;
* контексты родительских/дочерних селекторов;
* контексты комплексных селекторов;
* контексты медиа-запросов
* группировки подстрок в нотации;
* синонимы состояний и медиа-запросов;
* наследование от эссенций стилей (расширение; аналог ``` @extend ``` в SASS) ;
* примеси эссенций (аналог ``` @include ``` в SASS);
* ассоциацию селекторов с эссенциями стилей; 
* манипуляция глобальными стилями CSS в рантайме.  



## Usage

```
npm install amirka --save
```

```js
import { mn } from "amirka/services/mn";
import { ready } from "amirka/services/ready";
import { mnSettings } from "amirka/mn-presets/mn.settings";
import { mnStyle } from "amirka/mn-presets/mn.style";
import { mnTheme } from "amirka/mn-presets/mn.theme"

mnSettings(mn);
mnStyle(mn);
mnTheme(mn);

ready(() => {
  mn
    .recursiveCheckNodeByAttr(document)
    .compile();
});
```


## For standalone example:


Инициализация standalone версии библиотеки может осуществляться следующим образом:

```html
<script src="https://dartline.ru/assets/amirka.mn.js"></script>
<script src="https://dartline.ru/assets/mn-styles/mn.settings.js"></script>
<script src="https://dartline.ru/assets/mn-styles/mn.style.js"></script>
<script>
/*
  Если в глобальном пространстве указанные переменные не будут найдены,
  то подгрузятся сопостваленные скрипты
*/
amirka.polyfill({
  'CSS.escape': 'https://dartline.ru/assets/standalone-shims/css.escape.shim.js'
  /*
  'Promise': 'https://dartline.ru/assets/standalone-shims/promise.shim.js',
  'setImmediate': 'https://dartline.ru/assets/standalone-shims/set-immediate.shim.js'
  */
}).finally(() => {
  mn
    .recursiveCheckNodeByAttr(document) //for className: .recursiveCheckNodeByClassName(document)
    .compile();  
});
</script>
```

### Example with mn.recursiveCheckNodeByAttr

Input:

```html
<div m="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</div>
```

Output:

```html
<div id="mn-styles">
  <style id="mn.media.mediaName">@media mediaName{[m~='c0F0@mediaName']{color:rgb(0,255,0)!important}}</style>
  <style id="mn.media.">
    [m~='f12']{font-size:12px}
    [m~='f14:h']:hover{font-size:14px}
    .parent [m~='cF00<.parent']{color:rgb(255,0,0)!important}
    [m~='bg0F0']{background:rgb(0,255,0)}
    [m~='sq40']{width:40px!important;height:40px!important}
    [m~='p10']{padding:10px!important}
    [m~='mb10']{margin-bottom:10px!important}
  </style>
</div>
```

### Example with mn.recursiveCheckNodeByClassName

Input:

```html
<div class="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</div>
```

Output:

```html
<div id="mn-styles">
  <style id="mn.media.mediaName">@media mediaName{.c0F0\@mediaName{color:rgb(0,255,0)!important}}</style>
  <style id="mn.media.">
    .f12{font-size:12px}
    .f14\:h:hover{font-size:14px}
    .parent .cF00\<\.parent{color:rgb(255,0,0)!important}
    .bg0F0{background:rgb(0,255,0)}
    .sq40{width:40px!important;height:40px!important}
    .p10{padding:10px!important}
    .mb10{margin-bottom:10px!important}
  </style>
</div>
```


### Notation

Запись нотации MN делится на 2 части:
* имя эссенции;
* контекст эссенции (комбинированный селектор и медиа-запрос).

За имя эссенции отвечает подстрока от начала имени до первого служебного символа (``` <>.[]:+@ ```). 

Остальная часть нотации, включая первый служебный символ относится к контексту эссенции, в пределах которого стили эссенции применяются (селекторы и медиа-запросы).  Например:  

Example 1:  
``` ph10>1 ``` ->  
 имя эссенции: ``` ph10 ```;  контекст эссенции: ``` >1 ```

Example 2:  
``` bgF00<.theme-1 ``` ->  
 имя эссенции: ``` bgF00 ``` ;  контекст эссенции: ``` <.theme-1 ```

Example 3:  
``` cF:h  ``` ->   
имя эссенции: ``` cF ```;  контекст эссенции: ``` :h ```

Example 4:  
``` mh-10@sm>1  ``` ->   
имя эссенции: ``` mh-10 ```;  контекст эссенции: ``` @sm>1 ```

### Имя эссенции

Часть имени, которая отвечает за эссенцию, парсится для генерации стилей и также делится на 2 части: 
* префикс эссенции (статичная часть, собственно само имя эссенции);
* суффикс эссенции (параметризуемая часть, значение эссенции).

Префиксом имени эссенции является первая часть имени эссенции, состоящая из латинских букв в нижнем регистре. Оно может являться аббревиатурой. Соответственно, остальная часть имени эссенции является префиксом - параметризуемой частью. Например:  

Example 1:  
``` ph10 ``` ->  
префикс эссенции: ``` ph ```;  суффикс эссенции: ```10 ```

Example 2:  
``` bgF00 ``` ->  
префикс эссенции: ``` bg ```;  суффикс эссенции: ``` F00 ```

Example 3:  
``` cF  ``` ->   
префикс эссенции: ``` c ```;  суффикс эссенции: ``` F ```


### Контекст эссенции

Часть нотации, отвечающая за контекст эссенции может разделяться символом ``` > ``` на несколько частей, представляющие собой последовательность дочерних элементов до целевого элемента, на который распространяется влияние эссенции. Например:  
``` essenceValue>.child1>.child2>.targetChild ```


Затем полученные части могут разделяться символом ``` < ``` на несколько частей представляющие собой последовательность родительских элементов, при наличии которых стили эссенции вступают в силу. Например:  
``` essenceValue<.parent1<.parent2 ```


### Медиа-запросы в нотации 


Каждая полученная выше часть может разделяться символом ``` @ ```, отвечающий за имя медиа-запроса, при наличии которого стили эссенции вступают в силу. Например:  
``` essenceValue@mediaName ```  
``` essenceValue@mediaName<.parent ```  
``` essenceValue<.parent@mediaName ```  
``` essenceValue@mediaName>.targetChild ```  
``` essenceValue<.parent1@mediaName<.parent2 ```  
``` essenceValue@mediaName<.parent1<.parent2>.child1>.targetChild ```  

Допустимо указывать имена нескольких медиа-запросов, например так:

``` essenceValue@mediaName1<parent@mediaName2 ``` 

Однако в подобных случаях задействуется только первое найденное имя медиа-запроса. В данном случае, это ``` mediaName1 ```

Таким образом сделано для удобства использования нотации, например в случах, когда мы задаем общий медиа-запрос для нескольких атрибутов дочернего элемента, но для некоторых атрибутов этот медиа-запрос должен отличаться:
```html

<div m="(sq200|f20|f14@sm)>.child1@md">
  <div class="child1">
    текст
  </div>
</div>
  
```


Нотация ``` (sq200|f20|f14@sm)>.child1@md ``` распарсится как несколько таких строк:

1. ``` sq200>.child1@md ```  
2. ``` f20>.child1@md ```  
3. ``` f14@sm>.child1@md ```  

В строке *3* мы получим несколько имен медиа-запросов, но в силу вступит только первое имя медиа-запроса в этой последовательности.



### + Grouping

Группировка помогает сократить запись.

Несколько параметров можно сгруппировать вместе с помощью разделителя ``` | ``` между альтернативными подстроками внутри скобок.


Example:

Вместо этого
```html
<div m="bc00F>input:h bc00F>input:a bg0>input:h bg0>input:a"></div>
```
Вы можете сделать так:
```html
<div m="(bc00F|bg0)>input:(h|a)"></div>
```

Т.е., эти записи эквивалентны:  
Example 1:  
``` (bc00F|bg0)>input ``` ->   
``` bc00F>input bg0>input ```  

Example 2:  
``` input:(h|a) ``` ->   
``` input:h input:a ```  

Example 3: 
``` (bc00F|bg0)>input:(h|a) ``` ->   
``` bc00F>input:h bc00F>input:a bg0>input:h bg0>input:a ```




### + Escaping

В процессе применения MN могут возникать ситуации, когда Вам нужно экранировать служебные символы, например в таком случае:
```html
<div m="pt33.3%"></div>
```
Мы получим не то, чего ожидаем, так как точка является служебным символом
``` pt33.3%  ```  ->  
```css
[m~='pt33.3%'].3%{padding-top:33px}
```


Если мы хотим, чтобы точка попала в параметры эссенции, то мы должны экранировать её так:
```html
<div m="pt33\.3%"></div>
```
Таким образом, получим желаемое:
``` pt33\.3% ``` ->  
```css
[m~='pt33\\.3%']{padding-top:33.3%}
```



### Генерация медиа-запросов  


По умолчанию имя медиа-запроса генерируется в CSS как есть, например:  
INPUT:  
```html
<div m="f20@sm f10@print">текст</div>
```  

OUTPUT:  
```html
<style id="mn.media.sm">
  @media sm {
    [m~='f20@sm'] {
      font-size: 20px;
    }
  }
</style>
<style id="mn.media.print">
  @media print {
    [m~='f10@print'] {
      font-size: 10px;
    }
  }
</style>
```


Именам медиа-запросов в нотации можно установить синонимы.  
Пример:  
INPUT:  
```js
mn.media.sm = {
  query: '(max-width: 991px)',
  priority: 0
};
mn.media.xs = {
  query: '(max-width: 767px)',
  priority: 1
};
```  

```html
<div m="f18@sm f16@xs">текст</div>
```  

OUTPUT:  

```html
<style id="mn.media.sm">
  @media (max-width: 991px) {
    [m~='f18@sm'] {
      font-size: 18px;
    }
  }
</style>
<style id="mn.media.xs">
  @media (max-width: 767px) {
    [m~='f16@xs'] {
      font-size: 16px;
    }
  }
</style>
```



Если в имени медиа-запроса будет распознана сокращенная запись подпадающая под шаблон:
``` [min-width?: number]-[max-width?: number]x[min-height?: number]-[max-height?: number] ```

Тогда будут сгенерированы соответствующие медиа-запросы, например:  
INPUT:  
```html
<div m="f20@768-992x300-600">текст</div>
```  

OUTPUT:  
```html
<style id="mn.media.768-992x300-600">
  @media (min-width: 768px) and (max-width: 992px) and (min-height: 300px) and (max-height: 600px) {
    [m~='f20@768-992x300-600'] {
      font-size: 20px;
    }
  }
</style>

```

Параметры шаблона сокращенной записи медиа-запроса в нотации не явлюятся обязательными и некоторые из них можно опустить, например:  
INPUT:  
```html
<div m="f20@768 f30@992- f40@x600 f50@1000-1200 f3@x10-60">текст</div>
```  

OUTPUT:  
```html
<style id="mn.media.1000-1200">
  @media (min-width: 1000px) and (max-width: 1200px) {
    [m~='f50@1000-1200'] {
      font-size: 50px;
    }
  }
</style>
<style id="mn.media.768">
  @media (max-width: 768px) {
    [m~='f20@768'] {
      font-size: 20px;
    }
  }
</style>
<style id="mn.media.x10-60">
  @media (min-height: 10px) and (max-height: 60px) {
    [m~='f3@x10-60'] {
      font-size: 3px;
    }
  }
</style>
<style id="mn.media.992-">
  @media (min-width: 992px) {
    [m~='f30@992-'] {
      font-size: 30px;
    }
  }
</style>
<style id="mn.media.x600">
  @media (max-height: 600px) {
    [m~='f40@x600'] {
      font-size: 40px;
    }
  }
</style>
```


### Essences (Эссенции стилей)

Как создаются эссенции стилей:

```js
mn('btnTheme', {
  //priority: 10, - можно задать приоритет эссенции
  //exts: [ 'dn250' /*, ... */ ], - так можно наследовать свойства других эссенций, аналогично @extend в SASS
  //include: [ 'dn250' /*, ... */ ], - так можно примешивать свойства других эссенций, аналогично @include в SASS
  style: { //здесь указываем стили эссенции
    fontSize: '16px',
    display: 'inline-block',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative', 
    cursor: 'pointer'
  },
  childs: { //здесь мы можем добавлять определения для дочерних/вложенных элементов эссенции
    inner: { // inner - это просто именованное значение дочернего элемента для навигации по вложенным элементам
      selectors: [ ' .btn-inner' ], // здесь можно задать селекторы дочернего элемента
      //priority: 10, - приоритет можно задать дочерним элементам эссенции
      style: { //здесь указываем стили дочернего элемента эссенции
        width: '200px',
        maxWidth: '100%',
        color: '#FFF',
        padding: '0px 15px',
        position: 'relative',
        height: '45px',
        borderColor,
        borderStyle: 'solid',
        borderWidth: '0px',
        borderBottomWidth: '3px'
      }
      //,childs: { ... } - вложенностей может быть сколько угодно
    }
    //,other: { ... } - другой дочерний элемент
  }
});
```

Есть возможность устанавливать/менять атрибуты дочерних элементов эссенции, например, таким образом:  
```js
mn('btnTheme.inner', {
  style: {
    width: '250px'
  }
});
```


Пример того, каким образом может быть задекларирована эссенция ``` tbl ``` :
```js
mn('tbl', {
  style: {display: 'table'},
  childs: {
    cell: {
      selectors: [ '>*' ], 
      style: {
        display: 'table-cell',
        verticalAlign: 'middle'
      }
    }
  }
});
```  
или так:  
```js
mn('tbl', {
  style: {display: 'table'}
});
mn('tbl.cell',  {
  selectors: [ '>*' ], 
  style: {
    display: 'table-cell',
    verticalAlign: 'middle'
  }
});
```  

Работает это следующим образом:  

Example 1.  
Вы просто пишите в разметку:
```html
<div m="tbl">
  <div>текст</div>
</div>

```  
CSS для этой разметки генерируется автоматически:
```css
[m~='tbl']>*{display:table-cell;vertical-align:middle}
[m~='tbl']{display:table}
```

Example 2.
Как это работает с контекстами эссенций:
```html
<div m="tbl>.example2__item">
  <div class="example2__item">
    <div>текст</div>
  </div>
  <div class="example2__item">
    <div>текст</div>
  </div>
</div>
```
Сгенерированный CSS:
```css
[m~='tbl>.example2__item'] .example2__item>*{display:table-cell;vertical-align:middle}
[m~='tbl>.example2__item'] .example2__item{display:table}
```


Example 3.  
Более практичeский пример:
```html
<div m="mb10 lh">
  <a class="example__button" m="tbl w200 h50 tc cF bg0">
    <div>центрированный текст</div>
  </a>
</div>
```
Сгенерированный CSS:
```css
[m~='lh']{line-height:1}
[m~='bg0']{background:rgba(0,0,0,1) !important}
[m~='cF']{color:rgba(255,255,255,1) !important}
[m~='tc']{text-align:center !important}
[m~='tbl']>*{display:table-cell;vertical-align:middle}
[m~='tbl']{display:table}
[m~='h50']{height:50px !important}
[m~='w200']{width:200px !important}
[m~='mb10']{margin-bottom:10px !important}
```



### Rules (Обработчики, генерирующие стили)

На вход правил(функций), которые Вы задаете для генерации эссенций стилей, подставляются параметры извлеченные при предварительном парсинге строки эссенциим в результате сопоставления строки с последовательностью шаблонов:
1. ``` ^([a-z]+):name(.*?):suffix$ ```  
2. ``` ^(.*?):suffix(-i):ni$ ```  
3. ``` ^(([A-Z][a-z]+):camel|((\\-):negative?[0-9]+):num):value([a-z%]+):unit?(.*?):other?$ ```  

```js
params.ni || (params.ni = '');
params.i = params.ni ? '' : '!important';
```



PS: см. функцию **amirka/common/route-parse-provider**


#### Генерация эссенций стилей:
Example 1:

INPUT:  
```html
<div m="p20 mb20 dt5 br2">...</div> 
```
```js
mn('p', p => {
  return {
    style: {
      padding: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('mb', p => {
  return {
    style: {
      marginBottom: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('dt', p => {
  return {
    style: {
      top: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('br', p => {
  return {
    style: {
      borderRightWidth: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
```

OUTPUT:  
```css
[m~='p10']{padding:10px !important}
[m~='mb20']{margin-bottom:20px !important}
[m~='dt5']{top:5px !important}
[m~='br2']{border-right-width:2px !important}
```



Example 2:

Обработчик:  
```js
mn('x', p => {
  return {
    style: {
      transform: 'translate(' + ((p.x || '0') + (p.xu || 'px')) + ',' +
        ((p.y || '0') + (p.yu || 'px')) + ')' + 
        (p.s ? (' scale(' + (0.01 * p.s) + ')') : '') + p.i
    }
  };
}, '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([sS]([0-9]+):s)?$');
```
  
  
```html
<div m="x10y5">...</div>
```
```css
[m~='x10y5']{
  -khtml-transform:translate(10px,5px) !important;
  -ms-transform:translate(10px,5px) !important;
  -o-transform:translate(10px,5px) !important;
  -moz-transform:translate(10px,5px) !important;
  -webkit-transform:translate(10px,5px) !important;
  transform:translate(10px,5px) !important
}
```
  
  
```html
<div m="x12">...</div>
```
```css
[m~='x12']{
  -khtml-transform:translate(12px,0px) !important;
  -ms-transform:translate(12px,0px) !important;
  -o-transform:translate(12px,0px) !important;
  -moz-transform:translate(12px,0px) !important;
  -webkit-transform:translate(12px,0px) !important;
  transform:translate(12px,0px) !important
}
```
  
  
```html
<div m="x0y20%">...</div>
```
```css
[m~='x0y20%']{
  -khtml-transform:translate(0px,20%) !important;
  -ms-transform:translate(0px,20%) !important;
  -o-transform:translate(0px,20%) !important;
  -moz-transform:translate(0px,20%) !important;
  -webkit-transform:translate(0px,20%) !important;
  transform:translate(0px,20%) !important
}
```
  
  
```html
<div m="x0y20">...</div>
```
```css
[m~='x0y20']{
  -khtml-transform:translate(0px,20px) !important;
  -ms-transform:translate(0px,20px) !important;
  -o-transform:translate(0px,20px) !important;
  -moz-transform:translate(0px,20px) !important;
  -webkit-transform:translate(0px,20px) !important;
  transform:translate(0px,20px) !important
}
```
  
  
```html
<div m="x7%y20%">...</div>
```
```css
[m~='x7%y20%']{
  -khtml-transform:translate(7%,20%) !important;
  -ms-transform:translate(7%,20%) !important;
  -o-transform:translate(7%,20%) !important;
  -moz-transform:translate(7%,20%) !important;
  -webkit-transform:translate(7%,20%) !important;
  transform:translate(7%,20%) !important
}
```
  
  
```html
<div m="x0y20s90">...</div>
```
```css
[m~='x0y20s90']{
  -webkit-transform:translate(0px,20px) scale(0.9) !important;
  -moz-transform:translate(0px,20px) scale(0.9) !important;
  -o-transform:translate(0px,20px) scale(0.9) !important;
  -ms-transform:translate(0px,20px) scale(0.9) !important;
  -khtml-transform:translate(0px,20px) scale(0.9) !important;
  transform:translate(0px,20px) scale(0.9) !important
}
```



Для добавления статической эссенции и создания правил генерации эссенций используется метод ``` mn ```

```ts 
interface MinimalistNotation extends selectorsCompile {
  (essencePrefix: string, essenceOptions: EssenceOptions): MinimalistNotation;
  (essencePrefix: string, handler: EssenceHandler, matches?: string | string[]): MinimalistNotation;
  (essences: EssenceMapOptions): MinimalistNotation;
  $$storage: storage;
  propertiesStringify: cssPropertiesStringify;
  data: MinimalistNotationData;
  $$cache: FlagsMap;
  media: {[mediaName: string]: media};
  handlerMap: handlerMap;
  contextMode: string;
  disabled: boolean;
  recursiveCheckNodeByAttr: (nodes: Element[] | Element | Document) => MinimalistNotation;
  recursiveCheckNodeByClassName: (nodes: Element[] | Element | Document) => MinimalistNotation;
  checkClassName: (className: string) => MinimalistNotation;
  checkClassNames: (classNamesValue: string) => MinimalistNotation;
  checkAttrOne: (attrName: string, attrValue: string) => MinimalistNotation;
  checkAttr: (attrName: string, attrValue: string) => MinimalistNotation;
  ngCheck: (ngClass: string) => MinimalistNotation;
  checkNodeByClassName: (node: Element) => MinimalistNotation;
  checkNodeByAttr: (node: Element) => MinimalistNotation;
  css: (selector: string | {[n: string]: CssProps}, css?: CssProps) => MinimalistNotation;
  assign: (essencesNames: string[], selectors: string[]) => MinimalistNotation;
  parseMediaName: (mediaName: string) => media;
  clear: () => MinimalistNotation;
  compile: () => MinimalistNotation; //перекомиплировать стили для новых классов
  recompile: () => MinimalistNotation; //полностью перекомиплировать все стили
  deferCompile: () => MinimalistNotation;
  deferRecompile: () => MinimalistNotation;
  setKeyframes: (name: string, body: keyframes | string) => MinimalistNotation;
  set: MinimalistNotation;
}
```



### + Auto prefixes

Вы можете настроить автоподстановку префиксов для кроссбраузерности верстки, добавив имена свойств стилей в карту префиксов таким образом:
```js
mn.propertiesStringify.prefixedAttrs.transform = true;
mn.propertiesStringify.prefixedAttrs.transitionDuration = true;
mn.propertiesStringify.prefixedAttrs.pointerEvents = true;
mn.propertiesStringify.prefixedAttrs.userSelect = true;
mn.propertiesStringify.prefixedAttrs.filter = true;
mn.propertiesStringify.prefixedAttrs.boxSizing = true;
```

либо так:
```js
extend(mn.propertiesStringify.prefixedAttrs, {
  transform: true,
  transitionDuration: true,
  pointerEvents: true,
  userSelect: true,
  filter: true,
  boxSizing: true
});
```

, но лучше так:
```js
flags([ 
  'transform', 'transitionDuration', 'pointerEvents', 'userSelect', 'filter', 'boxSizing'
], mn.propertiesStringify.prefixedAttrs);
```


Указать какие именно префиксы должны подставляться Вы можете так:
```js
flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], mn.propertiesStringify.prefixes);
```

### + States

Состояние - в MN это часть записи нотации после двоеточия(``` : ```), которой может соответствовать аналогичные псевдоселекторы в терминах CSS.  
В MN мы стараемся использовать сокращенные записи. Так для одного имени состояния в MN можно указать несколько произвольных селекторов. 


Input:
```html
<i 
  class="ion-chevron-right" 
  m="x10:h cF00:a f16:(h|a)"
></i> 
```

```js
extend(mn.states, {
  h: [ ':hover' ],
  a: [ ':active', '.active' ]
});
```

Output:
```css
[m~='x10:h']:hover{
  -khtml-transform:translate(10px,0px) !important;
  -ms-transform:translate(10px,0px) !important;
  -o-transform:translate(10px,0px) !important;
  -moz-transform:translate(10px,0px) !important;
  -webkit-transform:translate(10px,0px) !important;
  transform:translate(10px,0px) !important
}
[m~='cF00:a']:active,
[m~='cF00:a'].active{
  color:rgba(255,0,0,1) !important
}
[m~='f16:(h|a)']:hover,
[m~='f16:(h|a)']:active,
[m~='f16:(h|a)'].active{
  font-size: 16px;
}
```

Если Вы укажете какое-либо иное незадекларированное состояние, то оно выводится как есть:
```css
f16:hz -> 
[m~='f16:hz']:hz{font-size: 16px;}

f16:hover -> 
[m~='f16:hover']:hover{font-size: 16px;}
```

#### Вы можете параметризовать состояния через квадратные скобки:

```js
extend(mn.states, {
  n: [ ':nth-child' ]
});
```

```css
f16:n[3n+2] -> 
[m~='f16:n[3n+2]']:nth-child(3n+2){font-size: 16px;}
```

PS: В связи с тем, что круглые скобки являются служебными символами MN, необходимыми для группировки подстрок, то вместо них применяются квадратные скобки.  


Вы можете без проблем в нотации записать псевдокласс отрицания:
```css
f16:not[.active] -> 
[m~='f16:not[.active]']:not(.active){font-size: 16px;}

f16:not[[type=number]] -> 
[m~='f16:not[[type=number]]']:not([type=number]){font-size: 16px;}
```

Вы можете указать в нотации несколько состояний:
```css
f16:(hover|active) -> 
[m~='f16:(hover|active)']:hover, [m~='f16:(hover|active)']:active{font-size: 16px;}
```


В состояниях предусмотрена возможность использования нестандартных псевдоклассов в качестве синонимов:  

Input:
```js
extend(mn.states, {
  i: [ 
    '::-webkit-input-placeholder', 
    '::-moz-placeholder', 
    ':-ms-input-placeholder', 
    '::placeholder' 
  ]
});
```


```html
<input class="cA:i" placeholder="имя"/>
```  

Output:
```css
[m~='cA:i']::-webkit-input-placeholder{color:rgb(170,170,170) !important}
[m~='cA:i']::-moz-placeholder{color:rgb(170,170,170) !important}
[m~='cA:i']:-ms-input-placeholder{color:rgb(170,170,170) !important}
[m~='cA:i']::placeholder{color:rgb(170,170,170) !important}
```


PS: селекторы с нестандартными псевдоклассами и браузерными префиксами для валидности автоматически разбивается на отдельные каскадные блоки.


### + Родительские/дочерние селекторы (Parent/child selectors)

Разделитель родительских селекторов: ``` < ```

Например, для записи ``` bgF00<.active ``` генерируется следующий селектор:  

```css
.active [m~='bgF00<.active'] { /* ... */ }
```
  
Так мы можем указать для текущего элемента при наличии какого родительского элемента будет отображаться стиль эссенции ``` bgF00 ```.


Разделитель дочерних селекторов: ``` > ```  
С дочерними селекторами всё точно также как и с родительскими, только наоборот.  


Например, для записи ``` bgF00>.active ``` генерируется следующий селектор:  
```css
[m~='bgF00>.active'] .active { /* ... */ }
```


### + Глубина (Depth)


Для задания определенной глубины вложенности мы можем подставить число перед селектором, например:  

```css
/* bgF00<1.active -> */
.active>[m~='bgF00<1.active'] { /* ... */ }

/* bgF00<2.active -> */
.active>*>[m~='bgF00<2.active'] { /* ... */ }

/* bgF00<3.active -> */
.active>*>*>[m~='bgF00<3.active'] { /* ... */ }
```

  
Если нужно чтобы стили эссенции были активны при наличии какого-либо селектора(в частности класс ``` active ```) на текущем элементе:
```css
/* bgF00<0.active -> */
.active[m~='bgF00<0.active'] { /* ... */ }
```

Если есть отрицательный знак, то мы получим распространение стиля эссенции на дочернии элементы:
```css
/* bgF00<-1.active -> */
[m~='bgF00<-1.active']>.active { /* ... */ }

/* bgF00<-2.active -> */
[m~='bgF00<-2.active']>*>.active { /* ... */ }
```


Вы можете игнорировать разделитель.  
Если нужно чтобы стили эссенции были активны при наличии какого-либо селектора на текущем элементе (в частности класс active), то Вы можете писать более лаконично и получать на выходе желаемое:  

```css
/* bgF00.active -> */
[m~='bgF00.active'].active { /* ... */ }
```


### + Complex selectors


Всё вышеперечисленное аналогично можем применять и для других селекторов c атрибутами:  
```css
/* bgF00>[type=text] -> */
[m~='bgF00>[type=text]'] [type=text] { /* ... */ }

/* bgF00[type=text] -> */
[m~='bgF00[type=text]'][type=text] { /* ... */ }
```

Пример более сложного селектора:
```css
/* bgF00.theme1.active -> */
[m~='bgF00.theme1.active'].theme1.active { /* ... */ }
```

Разделители подразумевают, что Вы можете совместно указать сколько угодно родительских и дочерних элементов и состояний в контексте эссенции:  
```css
/* bgF00.active<.md>.anyChild -> */
.md [m~='bgF00.active<.md>.anyChild'].active .anyChild { /* ... */ }
```


Example 1:  

Input:
```html
<a href="#">
  <i
    class="ion-chevron-right"
    m="x10<a:h cF00:a"
  ></i> 
</a>
<div m="c0F0:a<.parent1">...</div>
<div m="bg02<.parent1<.parent2">...</div>
<div m="c065:a<0.parent1">...</div>
<div m="bgD852<3.parent1<.parent2:h">...</div>
```

Output:
```css
[m~='cF00:a'].active,
[m~='cF00:a']:active{
  color:rgba(255,0,0,1) !important
}
a:hover [m~='x10<a:h']{
  -khtml-transform:translate(10px,0px) !important;
  -ms-transform:translate(10px,0px) !important;
  -o-transform:translate(10px,0px) !important;
  -moz-transform:translate(10px,0px) !important;
  -webkit-transform:translate(10px,0px) !important;
  transform:translate(10px,0px) !important
}
.parent1 [m~='c0F0:a<.parent1']:active,
.parent1 [m~='c0F0:a<.parent1'].active{
  color:rgba(0,255,0,1) !important
}
.parent1[m~='c065:a<0.parent1']:active,
.parent1[m~='c065:a<0.parent1'].active{
  color:rgba(0,102,85,1) !important
}
.parent2 .parent1 [m~='bg02<.parent1<.parent2']{
  background-color:rgba(0,0,0,0.13333333333333333) !important
}
.parent2:hover .parent1>*>*>[m~='bgD852<3.parent1<.parent2:h']{
  background-color:rgba(221,136,85,0.13333333333333333) !important
}
```


Example 2:  

Input:
```html
<div m="(sq50|bg0)<2.anyClass"></div>
<div m="(w50|h5|bg00F8)>5.innerItem"></div>
```
Output:
```css
.anyClass>*>[m~='(sq50|bg0)<2.anyClass']{
  background:rgba(0,0,0,1) !important
}
.anyClass>*>[m~='(sq50|bg0)<2.anyClass']{
  width:50px !important;
  height:50px !important
}
[m~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  background:rgba(0,0,255,0.5333333333333333) !important
}
[m~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  height:5px !important
}
[m~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  width:50px !important
}
```





## Как интегрировать "Minimalist Notation" в Angular 6


```ts

import { mn } from 'amirka/services/mn';
import { mnSettings } from 'amirka/mn-presets/mn.settings';
import { mnStyle } from 'amirka/mn-presets/mn.style';
import { mnTheme } from 'amirka/mn-presets/mn.theme';

mnSettings(mn)
mnStyle(mn);
mnTheme(mn);


//DIRECTIVES
import { MDirective } from 'amirka/directives/m.directive';

@NgModule({
  imports: [
    /* ... */
  ],
  declarations: [
    MDirective,
    /* ... */
  ],
  bootstrap: [
    //RootComponent
  ]
})
export class AppModule {}


```


## Как интегрировать "Minimalist Notation" в React


```jsx
// root.jsx
import React, { Component } from 'react';
import { mnSettings } from 'amirka/mn-presets/mn.settings';
import { mnStyle } from 'amirka/mn-presets/mn.style';
import { mnTheme } from 'amirka/mn-presets/mn.theme';
import { Mn } from 'amirka/react-mn-component';
import { MyComponent } from './my-component';

const presets = [ mnSettings, mnStyle, mnTheme ];
export class Root extends Component {
  render() {
    return (
      <Mn presets={presets}>
        <MyComponent></MyComponent>
      </Mn>
    );
  }
}


// my-component.jsx
import React, { Component } from 'react';
import { MnConsumer } from 'amirka/react-mn-component';

export class MyComponent extends Component {
  render() {
    return (
      <MnConsumer>
      {
        ({ m }) => (
          <div m={m('tbl c0F0 bg0 w h100vh tc f40')}>
            <div>
              Hello React!
            </div>
          </div>
        )
      }
      </MnConsumer>
    );
  }
}


```




# From the author (temporarily).



В некоторых СSS-фреймворках, в том же Twitter Bootstrap, в некоторых случаях мы буквально указываем в разметке 
```html
class="text-center"
```
, вместо 
```html
style="text-align: center;"
``` 
– практически, это похоже на старый “преступный” инлайновый способ установки стилей элементам, отличие только в немного сокращенной форме записи и приоритете стилей. 



Не вижу блага в том, чтобы засорять проект файлами с лишним CSS-кодом, учитывая вероятность того, что он может неконтролируемо утрачивать актуальность по мере изменения разметки, для которой он писался. В проекте может накапливаться CSS код, актуальность которого нам достоверно неизвестна. При попытке подчистить его мы можем случайно удалить нечто нужное, в результате последствия сего деяния могут быть весьма печальными. Хотя, конечно, с этой проблемой помогают справляться компонентный подход, некоторые методологии, типа БЭМ, и правильно настроенные системы сборки, однако здесь Вы наблюдаете другое решение.


Главный недостаток инлайновых стилей в том, что они весьма громоздкие и делают разметку менее читаемой. CSS позволяет нам поместить необходимые стили в какой-то класс, а затем указывать этот класс для нужных нам элементов, но, в то же время, со временем развития проекта CSS разрастается, и в нем накапливается помойка из кучи неиспользуемых стилей, или, если проектом занимались "криворукие верстальщики", что часто мне приходилось наблюдать, то возникает куча граблей из кучи, перекрывающих друг друга правил СSS.


Некоторые разработчики бравирует тем, что используют в своих проектах Twitter Bootstrap 3, но на практике же мне приходилось сталкиваться с тем, что большинство разработчиков, каких я знал, делали дикие перекрытия поверх стандартных стилей в классах этой библиотеки. Во всех случаях использование Twitter Bootstrap 3, как такого, не имело большого смысла. 


В моих наблюдениях, чаще всего из всей помойки, которая есть в этой балластной библиотеке большой частью используется только адаптивная сетка, так как задачи часто весьма специфичные - я сам делал так первые полгода знакомства с Bootstrap 3. 
После знакомства с препроцессором SASS, я стал самостоятельно генерировать адаптивную сетку под свои нужды.

Адаптация Bootstrap 3, по сути, распространяется только на колонную сетку для разных разрешений экрана и некоторые предустановленные и часто невостребованные элементы. 

В адаптивной сетке мы используем суффиксы в нотации классов, соответствующие определенной ширине окна браузера,  а точнее медиа-запросам, такие как:  -xs,  -sm,  -md, -lg. Например:  col-sm-6, col-md-4, col-lg-6.


На мой взгляд, упущение Bootstrap 3 в том, что префиксы не предусмотрены для адаптивности других актуальных стилей - классов: text-left, text-center и т.п. – например: text-center-xs, text-left-md.


По понятным причинам подобная нотация не предусмотрена для адаптивности размеров шрифтов, например: font-size-sm-14, font-size-lg-20. Хотя, для моих задач эта особенность востребована, я понимаю, что генерация классов для всех размеров шрифтов даст много бесполезного CSS-кода.


Кстати, обратите внимание, что чем больше CSS-кода, тем сильнее тормозит браузер. Это обусловоено тем, что под капотом браузера каскады стилей, грубо говоря, представляют из себя ранжированный список шаблонов, с каждым из которых сопоставляется каждый элемент разметки при каждом рендеринге. Чем более насыщно DOM-дерво и чем длиннее список каскадных правил, тем более явно торможение.  Торможение особенно явно, когда применяется анимация, т.к. рендеринг анимации может приводить к увеличению частоты этих сопоставлений.


Мой поход к верстке - это хорошо зарекомендовавший себя общий оптимальный подход большинства CSS-фреймворков, к которому мы приходим опытным путём. Мной он частично позаимствован у многим известного Twitter Bootstrap. Суть подхода в том, чтобы определять в каждом CSS классе минимальный набор стилей для учета многих распространенных ситуаций, что позволяет нам:
* не добавлять новые классы для похожих случаев;
* избежать избыточные перекрытия стилей;
* не путаться в громоздком CSS коде, тщетно резервируя в своем головном мозге “ячейки памяти” под все эти непрерывно размножающиеся селекторы и каскады стилей. 

Идея создания технологии MN возникла в тот момент, когда в процессе профессиональной деятельности мне вошло в привычку писать CSS примерно таким образом:
```css
.p10{
  padding: 10px;
}
.pl10{
  padding-left: 10px;
}
.mh5{
  margin-left: 5px;
  margin-right: 5px;
}
@media (max-width: 768px){
  .p10-xs{
    padding: 10px;
  }
  .pr10-xs{
    padding-right: 10px;
  }
}
```
В моём коде уже присутствовала определенная нотация сопоставимая со строго определенными атрибутами стилей, их значениями и медиа-запросами. 

Сначала я старался автоматизировать генерацию классов препроцессорами LESS, затем SASS (приведу примеры позже).

Затем я задумался над разработкой своей технологии, предполагающей генерацию стилей на основании нотации имен классов в самой разметке, которая позволила бы ещё более автоматизировать процесс разработки.

Дабы проработать все нюансы я детальнее изучил методологию BEM, с которой познакомился ранее в 2017 году. BEM предлагает уникальное именование компонентов и их составляющих с целью избежания коллизий имен из разных компонентов, иерархию размещения исходников компонентов, которая по сути подобна оной в методологии компонентного подхода. В этом замысел понятен, однако мой подход позвоялет также уменьшить написание лишнего кода, систематизировать именование классов и улучшить понимание их назначения в разметке. 
  

Согласитесь, Вам в любом случае приходится писать в разметке имена классов, и если MN с чем-то сравнивать, то например: 
1. Cуммарное значение атрибута ``` class ``` или ``` m ``` в Вашей разметке может быть даже меньше, чем имена классов в BEM.
2. Не нужно писать CSS. 
3. Имена классов почти буквально сами говорят за себя, что конкретно они делают.
4. Извечная проблема программиста: "Как назвать переменную?". В большинстве случаев Вы экономите время и умственную энергию, избавляя себя от необходимости лишний раз думать о том, как лучше назвать класс для какого-либо элемента, так как Вы руководствуетесь заранее определенным шаблоном.
5. Однажды определённые эссенции и правила генерации эссенций в перспективе формируют легко расширяемую, гибкую и конечную фундаментальную базу, которая может выступать в роли общепринятого стандарта для большинства разработчиков, снижающего порог вхождения.
6. Благодаря гибкости и реактивной природе технологии, на основе базовых эссенций и правил их генерации создаётся многократно переиспользуемый код.
  

Методология BEM в аспектах своей громоздкости и неадаптивности несколько противоположна методологии, которой я придерживаюсь, но её вполне можно применять совместно. Например, для того, чтобы придать вашей разметке немного семантики, которая поможет Вам глядя на разметку понять, что такой-то фрагмент разметки имеет отношение именно к такому-то компоненту. Зачастую, это и так не сложно понять, но тем не менее.
Совместное применение BEM также целесообразно когда Вы пишите CSS для создания тем, кастомизации цветовых схем, размеров шрифтов и прочих атрибутов, не требующих изменения кода самой разметки.


В моей нотации вместо понятия "Элемент" присутствует понятие "Эссенция стиля", вокруг которой вращается всё. Альтернативой понятиям "Блок" и "Модификатор состояния" является "Контекст эссенции", который, по сути, является улучшенной альтернативой CSS-селекторов. Посредством этих селекторов можно лаконично указать все те ситуации, при которых стили эссенции становятся активными.


Когда я создавал MN, моей целью было:  

1. Автоматизировать генерацию CSS, ибо мой ручной способ написания CSS стал механическим. Если я и так добавляю новые классы для каждого отдельного значения атрибута стиля, именуя их соответствующими аббревиатурами - в чём наблюдается прямая зависимость, то почему бы мне не сделать их генерацию автоматической прямо из самой разметки, дабы больше не открывать CSS-файл? Это гениально! Это похоже на своеобразную реализацию парадигмы реактивности в CSS!
Как известно, разметка имеет смысл без CSS, но сам по себе CSS не имеет смысла без разметки. В нашем же случае всё нужное в одном месте. Разметка автономна и вся информация о её внешнем виде находится в ней самой.
В этом подходе есть нечто общее с директивным подходом Angular. Разница между чистым CSS и MN, примерно такая же как между VanillaJS и Angular, или как между jQuery и Angular. В первом случае Вы манипулируете DOM-элементами вручную, вручную прописываете в JS селекторы элементов, для которых нужно инициализировать какой-либо плагин или повесить событие. Во втором случае Вы просто пишите на нужном элементе в разметке директиву, которая инициализирует компонент или устанавливает выполняемое выражение по наступлению какого-либо события.  

2. Избежать коллизий с именами классов. Предусмотрена генерация стилей для отдельного кастомного атрибута ``` m ``` в разметке. В нотации нахальным образом эксплуатируется использование служебных символов, которые, вряд ли, кто-то станет использовать добровольно, так как их ручное экранирование в CSS достаточно накладно и напряжно для чтения. На служебные символы опирается жесткий каркас нотации в MN, которая позволяет Вам минимально ограничиваться в параметризации эссенций нотации. Также имеется удобная возможность при необходимости экранировать символы, являющиеся служебными, если они должны находится в параметрах эссенции.

3. Разработать максимально адаптивную и лаконичную систему нотации, учитывающую мутабельность стилей в зависимости от изменения состояния, атрибутов и классов как на самом элементе, так и на его родительских элементах, и в зависимости от изменения медиа-запросов.  
C технологией MN у Вас может возникнуть ощущение, что каскады стилей переместились непосредственно в саму разметку. MN выглядит как более лаконичный аналог и альтернатива инлайновых стилей с мутабельностью в зависимости от медиа-запроса, состояния, атрибутов и классов как на самом элементе, так и на его родительских элементах. 

Все последующие фичи добавлялись уже в процессе применения MN в моих проектах. Я добавлял то, что позволяло сократить рутинные действия с написанием классов в самой разметке:  

1. Возможность указывать в нотации имени класса текущего элемента какой стиль будут иметь его дочерние элементы - это очень удобная фича, которая многократно меня выручала.  

2. Сокращение записи нескольких имен классов со схожими подстроками за счет разработанной мной нотации группировки подстрок и алгоритма их парсинга;  

Некоторые фичи были добавлены чисто экспериментально в силу того, что нечто подобное есть в других препроцессорах, а кое-что представлялось возможным и легко достижимым:  

 
1. Наследование от эссенций стилей (расширение). Это прикольная фича. Иногда она нужна, но редко необходима в силу других особенностей MN. Я не рекомендую её использование без необходимости, в связи с тем, что:
* во-первых множественное наследование делает код сложнее для понимания;
* во-вторых, когда эссенция ``` A ``` наследует свойства эссенции ``` B ```, селекторы ассоциированные с эссенцией ``` A ```, также ассоциируются с эссенцией ``` B ```. Это в большинстве случаев приводит к тому, что сгенерированный конечный CSS-код за счёт дублирования селекторов по объему значительно может превышать CSS-код, получаемый с помощью примесей.

2. Примеси эссенций. Примеси эссенций можно использовать как альтернативу наследованию эссенций, в зависимости от того насколько это будет оптимально для текущего проекта с Вашей точки зрения. Примеси отличаются от наследования тем, что копируют непосредственно атрибуты донорских эссенций на шаге прекомпиляции эссенции, что более оптимально.

3. Ассоциация селекторов с эссенциями стилей - редко используемая, но очень удобная возможность.

4. Программная манипуляция глобальными стилями CSS в рантайме.  Из этого перечня манипуляция глобальными стилями CSS в рантайме используется наиболее часто в основном как способ альтернативного задания стилей, когда мы хотим совсем не видеть CSS-файлы в своем проекте.



Позднее я выяснил, что методология, которой я придерживаюсь, именуется как Functional/Atomic CSS.  
Пока я недостаточно вник в существующие на данный момент технологии, которые также ориентированы на эту методологию, но наивно полагаю, что мое решение покрывает все их возможности!))



## Минимализм!
В моем случае, минимализм подразумевает минимальную трудоемкость решения задач, в частности, следующее:
* минимальное количество символов кода;
* минимальное выделение памяти в Вашем головном мозге на запоминание классов и какие стили им соответствует; 
* исключение лишних абстракций. 


Главная идея: генерация стилей происходит на основе имен классов, найденных в разметке - ничего лишнего! Таким образом, у нас не будет неиспользуемого CSS-кода, и в большинстве случаев мы можем вообще не писать CSS-код, и даже не обращаться за CSS-файлами на сервер - CSS распаковывается, подобно rar-архиву, из самой разметки.  




Вы запоминаете только базовое правило нотации и правила интерпретации для параметризованных имен, которые устанавливаете Вы сами, а также опции на Ваше усмотрение: состояния, контексты родительских/дочерних селекторов и синонимы.


За основу взят принцип формирования имени класса от атрибута стиля – это, по сути, тот же сокращенный аналог инлайновых стилей, только я старался, сократить названия классов до аббревиатур, чтобы они были максимально краткими, но, тем не менее, чтобы не возникало коллизий. 
Часть имени класса отвечает за атрибут стиля, часть – за его значение - для адаптивности этого недостаточно, поэтому я сделал ещё больше, и это Вы можете увидеть из примеров приведенных выше.

Вы можете добавить свой обработчик, генерирующий ессенции стилей. Примеры находятся в директории репозитория ``` /src/mn-presets ```.



Я старался сделать парсинг и генерацию CSS как можно более оптимальной:
* если регистрируемое имя класса уже зарегистрировано однажды, то повторный вызов метода check для этого имени будет проигнорирован. 
* если было зарегистрировано новое имя класса, процедура рендеринга не происходит сразу, а откладывается в конец итерации цикла событий и отрабатывает единожды после всех предшествующих вызовов метода check.
* внутри имена классов сгруппированы по контекстам медиа-запросов и эссенциям стилей, для каждой из которых хранится отдельно прекомпилированный текст атрибутов CSS и текст селекторов CSS, остающиеся неизменными, если регистрация нового имени не относится к этой эссенции. Т.е. при регистрации новых имен классов происходит минимум операций с конкатенациями строк.
* обработчики-генераторы CSS срабатывают единожды для каждой уникальной эссенции.



Если по каким-то причинам Вы считаете, что в данный момент обращение за прекомпилированными стилями на сервер лучше, чем компиляция стилей в рантайме, то в перспективе можете сделать плагин для Вашей системы сборки. Я пока не вижу в этом необходимости, ибо в моих проектах это работает достаточно юзабельно. По ощущениям, это происходит не медленнее, чем регулярный dirty checking в AngularJS.




PS: Технология "Minimalist Notation" - это основная фича библиотеки "amirka". Помимо неё есть ещё множество инструментов.



Если Вы заинтересованы в более подробной документации и заинтересованы в развитии проекта, внесите свою лепту https://yasobe.ru/na/notation
