var isArray = require('isarray');
var doc = document;
var xhtmlNS = 'http://www.w3.org/1999/xhtml';
var svgNS = 'http://www.w3.org/2000/svg';
var xlinkNS = 'http://www.w3.org/1999/xlink';

module.exports = exports = createNS(xhtmlNS);
exports.svg = createNS(svgNS);
exports.ns = createNS;

/**
 * Returns an element creating function that will use a specified namespace as default.
 *
 * @param  {String} namespaceURI
 * @return {Function}
 */
function createNS(namespaceURI) {
	return function (name, props, children) {
		return createElementNS(namespaceURI, name, props, children);
	};
}

/**
 * Create an element in a specified namespace.
 *
 * @param  {String}               namespaceURI
 * @param  {String|Array}         name
 * @param  {Object}               [props]
 * @param  {String|Element|Array} [children]
 * @return {Element|DocumentFragment}
 */
function createElementNS(namespaceURI, name, props, children) {
	if (props && props.nodeType > 0 || isArray(props) || typeof props !== 'object') {
		children = props;
		props = null;
	}

	var element;
	if (isArray(name)) {
		element = doc.createDocumentFragment();
		children = name;
	} else {
		var temp = name.match(/^[\w\-]+/);
		element = doc.createElementNS(namespaceURI, temp ? temp[0] : 'div');
		if ((temp = name.match(/#([\w\-]+)/))) element.id = temp[1];
		if ((temp = name.match(/\.[\w\-]+/g))) element.className = temp.join(' ').replace(/\./g, '');
		if (~name.indexOf('[')) {
			props = props || {};
			var re = /\[([\w\-]+)=([^\[\]]+)\]/g;
			while ((temp = re.exec(name)) != null) if(!(temp[1] in props)) props[temp[1]] = temp[2];
		}
		if (props) applyProperties(element, props);
	}

	if (children || typeof children === 'string') {
		if (!isArray(children)) children = [children];
		for (var i = 0, item, type; item = children[i], type = typeof item, i < children.length; i++) {
			if (type === 'string') element.appendChild(doc.createTextNode(item));
			else if (item && item.nodeType > 0) element.appendChild(item);
		}
	}

	return element;
}

/**
 * Adds attributes & properties to element.
 *
 * @param  {Element} element
 * @param  {Object}  props
 */
function applyProperties(element, props) {
	for (var attr in props) {
		// use direct assignment for event listeners
		if (!attr.indexOf('on')) element[attr] = props[attr];
		// handle style as an object
		else if (attr === 'style' && typeof props[attr] === 'object')
			for (var rule in props[attr]) element.style[rule] = props[attr][rule];
		// add class and className to already present classes
		else if (attr === 'class' || attr === 'className')
			element.className += ' ' + props[attr];
		// use xlink namespace for 'xlink:...' attributes
		else element.setAttributeNS(!attr.indexOf('xlink') ? xlinkNS : null, attr, props[attr]);
	}
}