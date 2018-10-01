[Русский](https://github.com/mr-amirka/amirka/blob/master/src/from-author-ru.md)


# From the author



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

Вы можете добавить свой обработчик, генерирующий ессенции стилей. Примеры находятся в директории репозитория ``` /mn-presets ```.



Я старался сделать парсинг и генерацию CSS как можно более оптимальной:
* если регистрируемое имя класса уже зарегистрировано однажды, то повторный вызов метода check для этого имени будет проигнорирован.
* если было зарегистрировано новое имя класса, процедура рендеринга не происходит сразу, а откладывается в конец итерации цикла событий и отрабатывает единожды после всех предшествующих вызовов метода check.
* внутри имена классов сгруппированы по контекстам медиа-запросов и эссенциям стилей, для каждой из которых хранится отдельно прекомпилированный текст атрибутов CSS и текст селекторов CSS, остающиеся неизменными, если регистрация нового имени не относится к этой эссенции. Т.е. при регистрации новых имен классов происходит минимум операций с конкатенациями строк.
* обработчики-генераторы CSS срабатывают единожды для каждой уникальной эссенции.

## Links

Try this test: https://jsfiddle.net/j6d8aozy/44/

Home page: http://minimalist-notation.org

[Getting started](https://github.com/mr-amirka/amirka/blob/master/README.md)

[Пресеты](https://github.com/mr-amirka/amirka/blob/master/src/presets.md)

[Подробная документация](https://github.com/mr-amirka/amirka/blob/master/src/README.md)


Буду благодарен за Ваши отзывы и замечания. Пишите мне в [telegram](https://t.me/mr_amirka) .  
С любовью, Ваш mr.Amirka :)


Вы заинтересованы в развитии проекта? Внесите свою [лепту](https://yasobe.ru/na/notation)