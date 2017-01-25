# API Documentation
<a name="Symbol"></a>

## Symbol(description) ⇒ <code>[Symbol](#Symbol)</code> &#124; <code>string</code>
Polyfill for ES6 symbol class.

Mixins and component classes often want to associate private data with an
element instance, but JavaScript does not have direct support for true
private properties. One approach is to use the
[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
data type to set and retrieve data on an element.

Unfortunately, the Symbol type is not available in Internet Explorer 11. In
lieu of returning a true Symbol, this polyfill returns a different string
each time it is called.

Usage:

    const fooSymbol = Symbol('foo');

    class MyElement extends HTMLElement {
      get foo() {
        return this[fooSymbol];
      }
      set foo(value) {
        this[fooSymbol] = value;
      }
    }

In IE 11, this sample will "hide" data behind an instance property that looks
like this._foo0. The underscore is meant to reduce (not eliminate) potential
accidental access, and the unique number at the end is mean to avoid (not
eliminate) naming conflicts.

  **Kind**: global function
**Returns**: <code>[Symbol](#Symbol)</code> &#124; <code>string</code> - — A Symbol (in ES6 browsers) or unique string ID (in
ES5).  

| Param | Type | Description |
| --- | --- | --- |
| description | <code>string</code> | A string to identify the symbol when debugging |

