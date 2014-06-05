/*global DocumentFragment */
var e = require('e');
var assert = require('assert');

describe('e.ns(namespaceURI)', function () {
	it('should create an element creator for passed namespace', function () {
		var svg = e.ns('http://www.w3.org/2000/svg');
		var el = svg('circle');
		assert(el.namespaceURI === 'http://www.w3.org/2000/svg');
		assert(el instanceof SVGCircleElement);
	});
});

describe('e(name, [props], [children])', function () {
	it('should use the xhtml namespace', function () {
		assert(e('div').namespaceURI === document.createElement('div').namespaceURI);
	});
	describe('name', function () {
		it('should create a specified element type', function () {
			assert(e('div').nodeName === 'DIV');
			assert(e('a').nodeName === 'A');
			assert(e('em').nodeName === 'EM');
			assert(e('script').nodeName === 'SCRIPT');
		});
		it('should set classes', function () {
			var el = e('div.foo');
			assert(el.nodeName === 'DIV');
			assert(el.className === 'foo');
			el = e('div.foo.bar');
			assert(el.nodeName === 'DIV');
			assert(el.className === 'foo bar');
		});
		it('should set ID', function () {
			var el = e('div#foo');
			assert(el.nodeName === 'DIV');
			assert(el.id === 'foo');
		});
		it('should set ID and classes', function () {
			var el = e('div#foo.bar');
			assert(el.nodeName === 'DIV');
			assert(el.id === 'foo');
			assert(el.className === 'bar');
			el = e('div#foo.bar.baz');
			assert(el.nodeName === 'DIV');
			assert(el.id === 'foo');
			assert(el.className === 'bar baz');
		});
		it('should default to div when no element type is specified', function () {
			assert(e('.foo').nodeName === 'DIV');
			assert(e('#foo.bar').nodeName === 'DIV');
			assert(e('#foo.bar.baz').nodeName === 'DIV');
		});
		it('should support hyphens in id/class names', function () {
			assert(e('.foo-bar.bar-baz').className === 'foo-bar bar-baz');
			assert(e('#foo-bar').id === 'foo-bar');
		});
	});
	describe('[props]', function () {
		it('should be optional', function () {
			assert(e('div', 'foo').innerHTML === 'foo');
		});
		it('should set HTML element properties', function () {
			var iProps = {
				src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
				width: 100,
				height: 200
			};
			var img = e('img', iProps);
			assert(img.src === iProps.src);
			assert(img.width === iProps.width);
			assert(img.height === iProps.height);
		});
		it('should set event handlers', function () {
			var fn = function () {};
			var img = e('img', {
				onclick: fn
			});
			assert(img.onclick === fn);
		});
	});
	describe('[children]', function () {
		it('should be optional', function () {
			assert(e('div').innerHTML === '');
			assert(e('div', {  }).innerHTML === '');
		});
		describe('as a string', function () {
			it('should append a textNode', function () {
				var el = e('div', {}, 'foo');
				assert(el.children.length === 0);
				assert(el.childNodes.length === 1);
				assert(el.childNodes[0].nodeValue === 'foo');
				el = e('div', 'foo');
				assert(el.children.length === 0);
				assert(el.childNodes.length === 1);
				assert(el.childNodes[0].nodeValue === 'foo');
			});
			it('should append an empty textNode when empty string is passed', function () {
				var el = e('div', {}, '');
				assert(el.children.length === 0);
				assert(el.childNodes.length === 1);
				assert(el.childNodes[0].nodeValue === '');
				el = e('div', '');
				assert(el.children.length === 0);
				assert(el.childNodes.length === 1);
				assert(el.childNodes[0].nodeValue === '');
			});
		});
		describe('as an element', function () {
			it('should append an element', function () {
				var child = e('h1');
				var container = e('div', {}, child);
				assert(container.children.length === 1);
				assert(container.children[0] === child);
				container = e('div', child);
				assert(container.children.length === 1);
				assert(container.children[0] === child);
			});
		});
		describe('as an array', function () {
			it('should append elements', function () {
				var children = [
					e('h1'),
					e('em')
				];
				var container = e('div', {}, children);
				assert(container.childNodes.length === 2);
				assert(container.childNodes[0] === children[0]);
				assert(container.childNodes[1] === children[1]);
				container = e('div', children);
				assert(container.childNodes.length === 2);
				assert(container.childNodes[0] === children[0]);
				assert(container.childNodes[1] === children[1]);
			});
			it('should append text nodes', function () {
				var children = [
					'foo',
					''
				];
				var container = e('div', {}, children);
				assert(container.childNodes.length === 2);
				assert(container.childNodes[0].nodeValue === children[0]);
				assert(container.childNodes[1].nodeValue === children[1]);
				container = e('div', children);
				assert(container.childNodes.length === 2);
				assert(container.childNodes[0].nodeValue === children[0]);
				assert(container.childNodes[1].nodeValue === children[1]);
			});
			it('should ignore other values', function () {
				var children = [
					e('h1'),
					'foo',
					'',
					e('em'),
					[],
					{},
					null,
					true,
					false,
					undefined
				];
				var container = e('div', {}, children);
				assert(container.childNodes.length === 4);
				assert(container.childNodes[0] === children[0]);
				assert(container.childNodes[1].nodeValue === children[1]);
				assert(container.childNodes[2].nodeValue === children[2]);
				assert(container.childNodes[3] === children[3]);
				container = e('div', children);
				assert(container.childNodes.length === 4);
				assert(container.childNodes[0] === children[0]);
				assert(container.childNodes[1].nodeValue === children[1]);
				assert(container.childNodes[2].nodeValue === children[2]);
				assert(container.childNodes[3] === children[3]);
			});
		});
		describe('as other value', function () {
			it('should ignore other values', function () {
				assert(e('div', {}, {}).childNodes.length === 0);
				assert(e('div', {}, null).childNodes.length === 0);
				assert(e('div', {}, true).childNodes.length === 0);
				assert(e('div', {}, false).childNodes.length === 0);
				assert(e('div', {}, undefined).childNodes.length === 0);
				assert(e('div', null).childNodes.length === 0);
				assert(e('div', true).childNodes.length === 0);
				assert(e('div', false).childNodes.length === 0);
				assert(e('div', undefined).childNodes.length === 0);
			});
		});
	});
});

describe('e(children)', function () {
	it('should return a document fragment', function () {
		assert(e([]) instanceof DocumentFragment);
	});
	it('should append elements and ', function () {
		assert(e([]) instanceof DocumentFragment);
	});
});

describe('e.svg(name, [props], [children])', function () {
	it('should use the svg namespace', function () {
		var el = e.svg('circle');
		assert(el.namespaceURI === 'http://www.w3.org/2000/svg');
		assert(el instanceof SVGCircleElement);
	});
	describe('[props]', function () {
		it('should set SVG element properties', function () {
			var svgProps = {
				width: 100,
				height: 200
			};
			var image = e.svg('image', svgProps);
			assert(image.width.baseVal.valueInSpecifiedUnits === svgProps.width);
			assert(image.height.baseVal.valueInSpecifiedUnits === svgProps.height);
		});
		it('should use xlink namespace for xlink properties', function () {
			var svgProps = {
				'xlink:href': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
			};
			var image = e.svg('image', svgProps);
			assert(image.href.baseVal === svgProps['xlink:href']);
		});
	});
});