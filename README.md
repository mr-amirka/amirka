# Amirka

MinimalistNotation и прочие инструменты в дополнение к Lodash :)
  

Буду благодарен за Ваши отзывы и замечания. Пишите мне в telegram https://t.me/mr_amirka .  
С любовью, Ваш mr.Amirka :)
  
   

Библиотека Amirka включает в себя:  
- Minimalist Notation (технология, оптимизирующая процесс верстки);  
- Deal (Отменяемый Promise c реализаций интерфейса cancel и progress);  
- прочие сомнительные штуки...  


### Почему всё находится в одной библиотеке?

1. Все функции находятся в составе одной библиотеки, потому как в ней многократно переиспользуются собственные функции.  
2. Мне было довольно быстро и легко разрабатывать и перерабатывать все эти функции в рамках одного проекта и одной экосистемы.  
3. Я сторонник такого подхода, в котором весь исходный код проекта опирается на единую фундаментальную базу. При таком подходе легче ориентироваться, и он не содержит в себе дублирующуюся имплементацию методов схожих по назначению в каждом отдельном автономном компоненте, увеличивающую суммарный объем исходного кода.
4. При необходимости Вы можете имортировать только необходимые файлы библиотеки.
 

## Minimalist Notation.

Minimalist Notation (MN) (минималистическая нотация) - это технология генерации стилей, основанная на парсинге разметки. В текущей версии для веб-приложений генерация осуществляется непосредственно в СSS. Технология колоссально ускоряет процесс верстки и может использоваться дополнительно с традиционными технологиями, либо заменять их полностью.  

Преимущество перед традиционными технологиями CSS-препроцессинга в том, что разработчик избавляется от необходимости писать CSS. CSS генерируется автоматически на основании нотации и заданных разработчиком правил генерации стилей. Разработчику больше не нужно контролировать, какие стили используются в его разметке, а какие - нет, ибо отныне стили генерируются динамически только для того, что присутствует в разметке. 


Demo page: https://dartline.ru/minimalist-notation

Try this test: https://jsfiddle.net/Amirka/j6d8aozy/42/

Home page: http://minimalist-notation.dartline.ru


PS:   
Технология ориентирована на методологию Functional/Atomic CSS - не так давно меня просветили в теории.  
Валерий, СПАСИБО!  

По названию методологии намониторил подобные проекты: https://acss.io/ , https://www.npmjs.com/package/functional-css


PS: Если Вы верстаете по методологии Functional/Atomic CSS, то: 
* со временем Вы с первого взгляда понимаете смысл каждого класса в разметке;
* имеете возможность легко стандартизировать правила нотации и именования классов;
* разметку легко переиспользовать в новом проекте, если он предусматривает тот же базовый набор функциональных классов в CSS. 
* в случае внесения правок в дизайн, Вы будете менять разметку HTML, внося минимум правок в CSS.
* у Вас прямые руки - Вы не натыкаетесь на грабли с перекрытиями стилей;
* имеете возможность настроить Вашу систему сборки под автоматическую генерацию CSS из классов в разметке;
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



PS: Если у Вас вызывает беспокойство, почему некоторые атрибуты имеют флаг ``` !important ```, то это обусловлено тем, что атомные классы должны быть более приоритетными, чем традиционные классы и сложные селекторы, так как применение атомных классов подразумевает более точечную кастомизацию разметки поверх других более общих правил CSS. Например, во флаге ``` !important ``` была необходимость когда я применял технологию ``` MN ``` вместе с ``` Angular Material (MD) ``` для корректировки и кастомизации внешнего вида некоторых элементов, так как стили комплексных селекторов из MD перекрывали стили MN. Однако такой подход может создавать Вам грабли, если Вы захотите посредством JS динамически менять стиль элемента, на который распространяется действие флага ``` !important ``` из CSS. Поэтому этот нюанс стоит учитывать. Например, это предусмотрено в некоторых дефолтных правилах MN генерации эссенций стилей. Вы можете добавить суффикс ``` -i ``` в конец имени эссенции:  
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
mn.css('.theme-bg', {
  backgroundColor: '#EEE'
});
mn.css('.theme-b', {
  borderColor: '#CCC'
});
```
или так с эссенциями:
```js
mn('theme-bg', {
  style: {
    backgroundColor: '#EEE'
  }
});
mn('theme-b', {
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
* параметризуемую нотацию имен классов;
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
import {minimalistNotationProvider} from 'amirka/minimalist-notation-provider';
import {styleProvider} from 'amirka/common/style-provider';
import {readyProvider} from 'amirka/common/ready-provider';
const ready = readyProvider(window);
const style = styleProvider(document, 'mn-styles', 'mn.');
const mn = minimalistNotationProvider(style);

mn.checkAttrs.m = true;

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
amirka.polyfill({
  'CSS.escape': 'https://dartline.ru/assets/standalone-shims/css.escape.shim.js',
  'Promise': 'https://dartline.ru/assets/standalone-shims/promise.shim.js',
  'setImmediate': 'https://dartline.ru/assets/standalone-shims/set-immediate.shim.js'
}, () => {
  mn.checkAttrs.m = true;
  amirka.ready(() => {
    mn
      .recursiveCheckNodeByAttr(document) //for className: .recursiveCheckNodeByClassName(document)
      .compile();
  });  
});
</script>
```

### Example with mn.recursiveCheckNodeByAttr

Input:

```html
<x m="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</x>
```

Output:

```html
<x id="mn-styles">
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
</x>
```

### Example with mn.recursiveCheckNodeByClassName

Input:

```html
<x class="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</x>
```

Output:

```html
<x id="mn-styles">
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
</x>
```


### Notation

В базовой нотации MN имя класса делится на 2 части:
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

Часть имени, которая отвечает за эссенцию, парситься для генерации стилей и также делится на 2 части: 
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


Затем полученные части моут разделяться символом ``` < ``` на несколько частей представляющие собой последовательность родительских элементов, при наличии которых стили эссенции вступают в силу. Например:  
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

<x m="(sq200|f20|f14@sm)>.child1@md">
  <x class="child1">
    текст
  </x>
</x>
  
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
<x m="bc00F>input:h bc00F>input:a bg0>input:h bg0>input:a"></x>
```
Вы можете сделать так:
```html
<x m="(bc00F|bg0)>input:(h|a)"></x>
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
<x m="pt33.3%"></x>
```
Мы получим не то, чего ожидаем, так как точка является служебным символом
``` pt33.3%  ```  ->  
```css
[m~='pt33.3%'].3%{padding-top:33px}
```


Если мы хотим, чтобы точка попала в параметры эссенции, то мы должны экранировать её так:
```html
<x m="pt33\.3%"></x>
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
<x m="f20@sm f10@print">текст</x>
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
<x m="f18@sm f16@xs">текст</x>
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
<x m="f20@768-992x300-600">текст</x>
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
<x m="f20@768 f30@992- f40@x600 f50@1000-1200 f3@x10-60">текст</x>
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
<x m="tbl">
  <x>текст</x>
</x>

```  
CSS для этой разметки генерируется автоматически:
```css
[m~='tbl']>*{display:table-cell;vertical-align:middle}
[m~='tbl']{display:table}
```

Example 2.
Как это работает с контекстами эссенций:
```html
<x m="tbl>.example2__item">
  <x class="example2__item">
    <x>текст</x>
  </x>
  <x class="example2__item">
    <x>текст</x>
  </x>
</x>
```
Сгенерированный CSS:
```css
[m~='tbl>.example2__item'] .example2__item>*{display:table-cell;vertical-align:middle}
[m~='tbl>.example2__item'] .example2__item{display:table}
```


Example 3.  
Более практичeский пример:
```html
<x m="mb10 lh">
  <a class="example__button" m="tbl w200 h50 tc cF bg0">
    <x>центрированный текст</x>
  </a>
</x>
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
<x m="p20 mb20 dt5 br2">...</x> 
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
<x m="x10y5">...</x>
```
->
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
<x m="x12">...</x>
```
->
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
<x m="x0y20%">...</x>
```
->
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
<x m="x0y20">...</x>
```
->
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
<x m="x7%y20%">...</x>
```
->
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
<x m="x0y20s90">...</x>
```
->
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
interface mn {
  (essencePrefix: string, essenceOptions: EssenceOptions): mn;
  (essencePrefix: string, handler: EssenceHandler, matches?: string | string[]): mn;
  (essences: EssenceMapOptions): mn;
}
interface EssenceMapOptions {
  [essencePrefix: string]: EssenceOptions | EssenceHandler;
}

//функция-генератор эссенции
interface EssenceHandler {
  (params: ParamsOptions): EssenceOptions
}
interface ParamsOptions {
  [name: string]: string;
}

//Опции эссенции
interface EssenceOptions {
  inited?: boolean;
  priority?: number;
  style?: {
    [prop: string]: string | string[]
  };
  exts?: string[];
  include?: string[];
  selectors?: string[];
  childs?: {
    [childName: string]: EssenceOptions
  },
  media: {
    [mediaName: string]: EssenceOptions
  }
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

Состояние - в MN это часть имени в нотации класса после двоеточия(``` : ```), которой может соответствовать аналогичные псевдоселекторы в терминах CSS.  
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

Вы можете указать в нотации имени класса несколько состояний:
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



### + Родительские/дочерние селекторы (Parent/child selectors)

Разделитель родительских селекторов: ``` < ```

Например, для класса ``` bgF00<.active ``` генерируется следующий селектор:  

```css
.active [m~='bgF00<.active'] { /* ... */ }
```
  
Так мы можем указать для текущего элемента при наличии какого родительского класса будет отображаться стиль эссенции ``` bgF00 ```.


Разделитель дочерних селекторов: ``` > ```  
С дочерними селекторами всё точно также как и с родительскими, только наоборот.  


Например, для класса ``` bgF00>.active ``` генерируется следующий селектор:  
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
<x m="c0F0:a<.parent1">...</x>
<x m="bg02<.parent1<.parent2">...</x>
<x m="c065:a<0.parent1">...</x>
<x m="bgD852<3.parent1<.parent2:h">...</x>
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
<x m="(sq50|bg0)<2.anyClass"></x>
<x m="(w50|h5|bg00F8)>5.innerItem"></x>
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




Продолжение статьи в разработке... :(

Предшествующая версия: https://github.com/mr-amirka/minimalist