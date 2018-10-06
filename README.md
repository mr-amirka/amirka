[Русский](https://github.com/mr-amirka/amirka/blob/master/README-ru.md)


# Minimalist Notation

This is the best CSS framework and CSS-preprocessing technology that you will not be able to part with.  


Minimalist Notation (MN) is a technology for generating styles based on parsing the markup.
In the current version for web applications, the generation is done directly in the CSS.
Technology tremendously speeds up the layout process and can be used additionally with traditional technologies, or replace completely those.


The advantage over the traditional technologies of CSS-preprocessing is that the developer gets rid of the need to write CSS. CSS is generated automatically based on the notation and the style generate rules specified by the developer.
The developer no longer needs to control which styles are used in his markup and which ones are not, for from now on the styles are generated dynamically only for what is present in the markup.



[CLI](#cli)  
[Webpack Plugin](#webpack-plugin)  
[Runtime](#runtime)  
    [Standalone](#standalone)  
    [Integration](#integration)  
        [Integrating "Minimalist Notation" into Angular 6](#integrating-minimalist-notation-into-angular-6)  
        [Integrating "Minimalist Notation" into AngularJS](#integrating-minimalist-notation-into-angularjs)  
        [Integrating "Minimalist Notation" into React](#integrating-minimalist-notation-into-react)  

[More documentation](https://github.com/mr-amirka/amirka/blob/master/src/README.md)  
[Presets](https://github.com/mr-amirka/amirka/blob/master/src/presets.md)  
[From author](https://github.com/mr-amirka/amirka/blob/master/src/from-author.md)  



Try this tests:
* https://jsfiddle.net/j6d8aozy/51/  
* https://jsfiddle.net/j6d8aozy/46/  

Home page: http://minimalist-notation.org  



I would be grateful for your feedback and comments. Write me in a [telegram](https://t.me/mr_amirka).  
With love, your mr.Amirka :)


Are you interested in the development of this project? Do your [bit](https://yasobe.ru/na/notation).  



### CLI
```sh
npm install -g mn-cli
```

```sh
mn --compile ./src --output ./dist/styles.css
```

[More about CLI](https://github.com/mr-amirka/mn-cli)



### Webpack Plugin

```sh
npm install amirka --save
```


```js
const MnWebpackPlugin = require('amirka/webpack-plugin');

module.exports = {
  //...
  plugins: [
    //...
    new MnWebpackPlugin({
      input: {
        './dist/styles': './src',
        './dist/other': './other'
      },
      include: [ /^.*\.(html?|jsx?)$/ ],
      exclude: [ /\/node_modules\// ],
      presets: [
        require('amirka/mn-presets/mn.medias'),
      	require('amirka/mn-presets/mn.prefixes'),
      	require('amirka/mn-presets/mn.styles'),
      	require('amirka/mn-presets/mn.states'),
      	require('amirka/mn-presets/mn.theme')
      ]
      hideInfo: true
    })

  ]
  //...
};
```

PS: see amirka/node-mn.d.ts

<field key="region" dbtype="varchar" precision="255" phptype="string" null="false" default="" index="fulltext" />


## Runtime

```js
const mn = require("amirka/services/mn")
  .setPresets([
    require('amirka/mn-presets/mn.medias'),
    require('amirka/mn-presets/mn.runtime-prefixes'),
    require('amirka/mn-presets/mn.styles'),
    require('amirka/mn-presets/mn.states'),
    require('amirka/mn-presets/mn.theme')
  ]);
require('amirka/services/polyfill').andReady({
  'CSS.escape': 'assets/css.escape.shim.js',
  'setImmediate': 'assets/set-immediate.shim.js'
}).finally(() => {
  mn.getCompiler('m').recursiveCheck(document)
  mn.compile();

  console.log('minimalistNotation', mn.data);
});

```


### Standalone


```html
<script src="https://dartline.ru/assets/standalone-mn.js" async></script>
```


## Integration


### Integrating "Minimalist Notation" into Angular 6


```ts

require("amirka/services/mn").setPresets([
  require('amirka/mn-presets/mn.medias'),
  require('amirka/mn-presets/mn.runtime-prefixes'),
  require('amirka/mn-presets/mn.styles'),
  require('amirka/mn-presets/mn.states'),
  require('amirka/mn-presets/mn.theme')
]);

//DIRECTIVES
import { MDirective } from 'amirka/angular-mn';

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


### Integrating "Minimalist Notation" into AngularJS


```js

require("amirka/services/mn").setPresets([
  require('amirka/mn-presets/mn.medias'),
  require('amirka/mn-presets/mn.runtime-prefixes'),
  require('amirka/mn-presets/mn.styles'),
  require('amirka/mn-presets/mn.states'),
  require('amirka/mn-presets/mn.theme')
]);

const app = angular.module('app', [ /* ...*/ ]);
require('amirka/angularjs-mn')(app);
//...



```


### Integrating "Minimalist Notation" into  React

Example:

```jsx
// index.jsx
import React from 'react';
import { render } from 'react-dom';
import { Root } from './components/root';

require("amirka/services/mn").setPresets([
  require('amirka/mn-presets/mn.medias'),
  require('amirka/mn-presets/mn.runtime-prefixes'),
  require('amirka/mn-presets/mn.styles'),
  require('amirka/mn-presets/mn.states'),
  require('amirka/mn-presets/mn.theme')
]);
require('amirka/services/polyfill').andReady({
  'CSS.escape': 'assets/css.escape.shim.js'
}).finally(() => [].forEach.call(
  document.querySelectorAll('[root]'),
  (node) => render(<Root/>, node)
));


//root.jsx
import React, { Component } from 'react';
import { MyComponent } from './my-component';

export class Root extends Component {
	render() {
		return (<MyComponent/>);
	}
}

// my-component.jsx
import React, { Component } from 'react';
import { withMn, MnFrame } from 'amirka/src/react-mn';


class _MyComponent extends Component {
  render() {
    return (
      <div m="tbl c0F0 bg0 w h100vh tc f40">
        <div>
          <div>Hello React!</div>
          <MnFrame m="b0 bc00 bsSolid">
            <div m="sq10 bgF"></div>
          </MnFrame>
        </div>
      </div>
    );
  }
}

export const MyComponent = withMn(_MyComponent);

```

PS: MnFrame - the component that is displayed in the iframe
