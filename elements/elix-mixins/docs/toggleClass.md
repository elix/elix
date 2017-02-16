# API Documentation
<a name="toggleClass"></a>

## toggleClass(element, className, [force])
Helper function for standard classList.toggle() behavior on old browsers,
namely IE 11.

The standard
[classlist](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
object has a `toggle()` function that supports a second Boolean parameter
that can be used to succinctly turn a class on or off. This feature is often
useful in designing custom elements, which may want to externally reflect
component state in a CSS class that can be used for styling purposes.

Unfortunately, IE 11 does not support the Boolean parameter to
`classList.toggle()`. This helper function behaves like the standard
`toggle()`, including support for the Boolean parameter, so that it can be
used even on IE 11.

  **Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The element to modify |
| className | <code>string</code> | The class to add/remove |
| [force] | <code>boolean</code> | Force the class to be added (if true) or removed                            (if false) |

