# API Documentation
<a name="Symbol"></a>

## Symbol(description) ⇒ <code>[Symbol](#Symbol)</code> &#124; <code>string</code>
A helper function for simulating instances of the `Symbol` class in older
browsers, notably Microsoft Internet Explorer 11.

Mixins and component classes often want to associate private data with an
element instance, but JavaScript does not have direct support for true
private properties. Elix uses `Symbol` instances as property keys to set and
retrieve data on an element. This prevents accidental name collisions. While
it does not make the properties completely private, it does make them
somewhat harder to access, and hopefully discourages outside code from
directly manipulating the properties.

In modern browsers that support `Symbol`, the Elix `Symbol` helper function
simply returns a real `Symbol` instance. In browsers like IE that do not have
support for `Symbol`, the Elix `Symbol` helper function returns a different
string each time it is called.

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
like `this._foo0`, `this._foo1`, etc. The underscore is meant to reduce (not
eliminate) potential accidental access, and the unique number at the end is
mean to avoid (not eliminate) naming conflicts.

  **Kind**: global function
**Returns**: <code>[Symbol](#Symbol)</code> &#124; <code>string</code> - — A Symbol (in ES6 browsers) or unique string ID (in
ES5).  

| Param | Type | Description |
| --- | --- | --- |
| description | <code>string</code> | A string to identify the symbol when debugging |

