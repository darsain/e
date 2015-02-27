# Changelog

**1.1.0** :: *27th Feb 2015*

- ADD: Support for passing a number as **[children]** argument `e('span', 42)`. Previously this would have to be stringified `e('span', '42')`.
- ADD: Implemented `e.trust()` method for inserting trusted HTML `e('div', e.trust('foo <em>bar</em>'))`.

**1.0.0** :: *21th Nov 2014*

- ADD: Selector hash can also define attributes `a[href=/foo]`.
- ADD: Support for object form of a `style` property.
- CHANGE: Properties `class` and `className` now extend classes from selector hash. Previous behavior was to override.

**0.0.1** :: *5th Jun 2014*

Initial release.