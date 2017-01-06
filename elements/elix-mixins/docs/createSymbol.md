# API Documentation
<a name="createSymbol"></a>

## createSymbol(description)
Helper function to create a symbol that can be used for associating private
data with an element.

Mixins and component classes often want to associate private data with an
element instance, but JavaScript does not have direct support for true
private properties. One approach is to use the
[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
data type to set and retrieve data on an element.

Unfortunately, the Symbol type is not available in Internet Explorer 11. The
`createSymbol` helper function exists as a workaround for IE 11. Rather than
returning a true Symbol, it simply returns an underscore-prefixed string.

Usage:

    const fooSymbol = createSymbol('foo');

    class MyElement extends HTMLElement {
      get foo() {
        return this[fooSymbol];
      }
      set foo(value) {
        this[fooSymbol] = value;
      }
    }

In IE 11, this sample will "hide" data behind an instance property this._foo.
The use of the underscore is meant to reduce (not eliminate) the potential
for name conflicts, and discourage (not prevent) external access to this
data. In modern browsers, the above code will eliminate the potential of
naming conflicts, and better hide the data behind a real Symbol.

  **Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| description | <code>string</code> | A string to identify the symbol when debugging |

