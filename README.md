# e

Simple element creation / templating with SVG support.

**e** creates DOM elements/fragments ready to be appendChilded to other elements. It doesn't create HTML strings!

Inspired by [mithril](https://github.com/lhorie/mithril.js)'s view system.

## Install

With [component(1)](https://github.com/component/component):

```bash
$ component install darsain/e
```

## Usage

*Comments and results are showing HTML representation of returned elements. Returned value is always DOM element/fragment, not an HTML strings!*

```js
e('div');       // <div></div>
e('div.foo');   // <div class="foo"></div>
e('.foo');      // <div class="foo"></div>
e('#foo.bar');  // <div id="foo" class="bar"></div>
e('em', 'Foo'); // <em>Foo</em>
e('em', '');    // <em>#text</em> => adds an empty text node
e('input[disabled]');   // <input type="text" disabled="disabled">
e('div[data-flag]');    // <div data-flag=""></div>
e('i.icon.icon-check'); // <i class="icon icon-check"></i>
e('a', { href: '/foo' }, 'Foo'); // <a href="/foo">Foo</a>
e('a[href=/foo][target=_blank]', 'Foo'); // <a href="/foo" target="_blank">Foo</a>
// safety
e('div', '<em>foo</em>');          // <div>&lt;em&gt;foo&lt;/em&gt;</div>
e('div', e.trust('<em>foo</em>')); // <div><em>foo</em></div>
```

Nesting:

```js
e('ul.list', [
	e('li', 'foo'),
	e('li', [
		'bar',
		e('a', { href: '/baz' }, 'baz')
	])
]);
```

*Result:*

```html
<ul class="list">
	<li>foo</li>
	<li>bar <a href="/baz">baz</a></li>
</ul>
```

Create document fragment:

```js
var fragment = e([
	e('.foo', 'foo'),
	'bar', // text node
	null,  // will be skipped
	e('a', { href: '/baz' }, 'baz')
]);
document.body.appendChild(fragment);
```

*Result:*

```html
<body>
	<div class="foo">foo</div>
	bar
	<a href="/baz">baz</a>
</body>
```

SVG:

```js
e.svg('svg', { width: 100, height: 50 }, [
	e.svg('image', { x: 0, y: 0, width: 100, height: 50, 'xlink:href': '/example.jpg' }),
	e.svg('circle', { cx: 25, cy: 25, r: 10, fill: '#aaa' }),
	e.svg('circle', { cx: 75, cy: 25, r: 10, fill: '#666' }),
]);
```

*Result:*

```html
<svg width="100" height="50">
	<image x="0" y="0" width="100" height="50" xlink:href="/example.jpg"></image>
	<circle cx="25" cy="25" r="10" fill="#aaa"></circle>
	<circle cx="75" cy="25" r="10" fill="#666"></circle>
</svg>
```

## API

### e(name, [props], [children])

Create a single element.

**name** `String`

Element hash in a form of a selector specifying element type, ID, classes, and attributes.

Examples:

- `div` => `<div></div>`
- `div.foo` => `<div class="foo"></div>`
- `.foo` => `<div class="foo"></div>`
- `#foo.bar` => `<div id="foo" class="bar"></div>`
- `h1.foo.bar` => `<h1 class="foo bar"></h1>`
- `a[href=/foo]` => `<a href="/foo"></a>`

**[props]** `Object`

Element properties/attributes like `src`, `href`, `style`, ... you can also set id, classes, and bind event listeners:

```js
e('div', { id: 'foo', class: 'bar baz', onclick: clickHandler });
```

*Special behaviors:*

Properties `class` and `className` will **add** classes to those defined in the selector:

```js
e('.foo', {class: 'bar', className: 'baz'}); // <div class="foo bar baz"></div>
```

You don't have to use quotation marks for selector defined attribute values. As long as the value doesn't contain square brackets (`[]`) you are OK. If it does, use **props** object instead:

```js
e('a[href=https://example.com/foo?bar=baz]'); // OK
e('a[href=https://example.com/foo?bar[]=baz]'); // NOT OK!
e('a', {href: 'https://example.com/foo?bar[]=baz'}); // use props instead
```

Attributes defined in **props** object override attributes defined in selector:

```js
e('img[width=10][height=20]', {width: 20}); // <img width="20" height="20">
```

`style` property can be both a string or an object:

```js
e('div', {style: 'position: absolute; top: 0;'});
e('div', {style: {position: 'absolute', top: '0'});
```

**[children]** `String | Number | Element | Array`

Element child(ren). When:

- `String | Number` - It'll be transformed into a text node and appended. Empty strings are transformed into empty text nodes.
- `Element` - It'll be appended.
- `Array` - An array of strings, numbers, and/or elements to be appended. Other values are ignored, so if you want to skip an element, just pass `null` or `undefined`.

```js
e('h1', 'This is title'); // text node
e('button', e('i.icon')) // single child
// multiple children with one ignored
e('label[for=foo]', [
	e('input#foo[type=checkbox][name=foo]', {checked: true}),
	null, // will be skipped
	'This is a foo checkbox'
]);
```

Combining children skipping with ternary operators is quite handy:

```js
e('h1.title', [
	'Post title',
	!isAdmin ? null : e('a.edit', {href: editPostLink}, 'Edit')
]);
```

### e(children)

Creates a document fragment with children inside.

**children** `Array`

```js
var fragment = e([
	e('.foo', 'foo'),
	'bar', // text node
	null,  // will be skipped
	e('a', { href: '/baz' }, 'baz')
]);
document.body.appendChild(fragment);
```

### e.trust(value)

Creates a `String` object flaged as trusted. When **e** sees this object, it will use it as elements `innerHTML` as opposed to creating an escaped texNode and appending.

**value** `Mixed` Can be anything, it will be stringified and passed to element's `innerHTML`.

###### Example:

```js
e('div', e.trust('this is <strong>not</strong> gonna be escaped'));
```

This is kind of an edge case, but to keep the library simple, `e.trust()` can't be used in an array of children:

```js
e('div', [
	'this is gonna be deleted by trusted string next in line',
	e.trust('this will be used as div\'s innerHTML, deleting anything that came before')
])
```

Instead, wrap it in another element:

```js
e('div', [
	'this is gonna stay!',
	e('span', e.trust('<strong>no</strong> issues here'))
])
```

### e.svg(name, [props], [children])

Shorthand for creating elements in the SVG (`http://www.w3.org/2000/svg`) namespace URI:

### e.ns(namespaceURI)

Returns a function that'll use specified `namespaceURI` when creating an element. The core `e()` & `e.svg()` functions are a result of this, and you could re-implement them by:

```js
var ns = e.ns;
e = ns('http://www.w3.org/1999/xhtml');
e.svg = ns('http://www.w3.org/2000/svg');
// and use the same way
e('.foo', 'bar'); // <div class="foo">bar</div>
e.svg('svg');     // <svg></svg>
```

## Testing

To run tests:

```
component install --dev
component build --dev
```

And open `test/index.html`

## License

MIT