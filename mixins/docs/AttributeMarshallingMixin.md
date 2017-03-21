# API Documentation
<a name="module_AttributeMarshallingMixin"></a>

## AttributeMarshallingMixin ⇒ <code>Class</code>
Mixin which marshalls attributes to properties and vice versa.

If your component exposes a setter for a property, it's generally a good
idea to let devs using your component be able to set that property in HTML
via an element attribute. You can code that yourself by writing an
`attributeChangedCallback`, or you can use this mixin to get a degree of
automatic support.

This mixin implements an `attributeChangedCallback` that will attempt to
convert a change in an element attribute into a call to the corresponding
property setter. Attributes typically follow hyphenated names ("foo-bar"),
whereas properties typically use camelCase names ("fooBar"). This mixin
respects that convention, automatically mapping the hyphenated attribute
name to the corresponding camelCase property name.

Example: You define a component using this mixin:

    class MyElement extends AttributeMarshallingMixin(HTMLElement) {
      get fooBar() { return this._fooBar; }
      set fooBar(value) { this._fooBar = value; }
    }
    customElements.define('my-element', MyElement);

If someone then instantiates your component in HTML:

    <my-element foo-bar="Hello"></my-element>

Then, after the element has been upgraded, the `fooBar` setter will
automatically be invoked with the initial value "Hello".

Attributes can only have string values. If you'd like to convert string
attributes to other types (numbers, booleans), you must implement parsing
yourself.

This mixin also exposes helpers for reflecting attributes and classes to
the element. These helpers can be invoked during a component's constructor;
any attributes or classes set during the constructor are applied when the
component's `connectedCallback` is invoked.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

