# e

Simple element creation / templating with SVG support.

## Install

With [component(1)](https://github.com/component/component):

```bash
component install darsain/e
```

## Usage

```js
e('div');       // <div></div>
e('div.foo');   // <div class="foo"></div>
e('.foo');      // <div class="foo"></div>
e('#foo.bar');  // <div id="foo" class="bar"></div>
e('em', 'Foo'); // <em>Foo</em>
e('em', '');    // <em>#text</em> => adds an empty text node
e('i.icon.icon-check'); // <i class="icon icon-check"></i>
e('a', { href: '/foo' }, 'Foo'); // <a href="/foo">Foo</a>
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
var div = e('div');
var fragment = e([
	e('.foo', 'foo'),
	'bar', // text node
	e('a', { href: '/baz' }, 'baz')
]);
div.appendChild(fragment);
```

*Result:*

```html
<div>
	<div class="foo">foo</div>
	bar
	<a href="/baz">baz</a>
</div>
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

Element hash in a form of a selector specifying element type, ID, and classes.

Examples:

- `div` => `<div></div>`
- `div.foo` => `<div class="foo"></div>`
- `.foo` => `<div class="foo"></div>`
- `#foo.bar` => `<div id="foo" class="bar"></div>`
- `h1.foo.bar` => `<h1 class="foo bar"></h1>`

**[props]** `Object`

Element properties/attributes like `src`, `href`, `style`, ... you can also set id and classes this way, as well as bind event listeners:

```js
e('div', { id: 'foo', class: 'bar baz', onclick: clickHandler });
```

**[children]** `String | Element | Array`

Element child(ren). When:

- `String` - It'll be transformed into a text node and appended. Empty strings are transformed into empty text nodes.
- `Element` - It'll be appended.
- `Array` - An array of strings and/or elements to be appended. Other values are ignored, so if you want to skip an element, just pass `null`.

### e(children)

Creates a document fragment with children inside.

**children** `Array`

Same behavior as **children** argument above.

### e.svg(name, [props], [children])

Shorthand for creating elements in the SVG (`http://www.w3.org/2000/svg`) namespace URI:

### e.ns(namespaceURI)

Returns a function that'll use specified `namespaceURI` when creating an element. The core `e()` & `e.svg()` functions are a result of this.

You could re-implement them with:

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