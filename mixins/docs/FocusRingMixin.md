# API Documentation
<a name="module_FocusRingMixin"></a>

## FocusRingMixin ⇒ <code>Class</code>
Adds a `focus-ring` class to the element when (and only when) it receives
focus via the keyboard. This is useful for buttons and other components that
don't generally show a focus ring for mouse/touch interaction.

The following demo shows button that display a focus ring only when
you move the focus onto them via the keyboard, and not with the mouse or touch.

[Button components using FocusRingMixin](/demos/focusRing.html)

This is inspired by work on the `:focus-ring` pseudo-selector.
See https://github.com/wicg/focus-ring for details.

This mixin manages a `focus-ring` class on an element that be used to
suppress the default focus ring unless the keyboard was used. The element's
stylesheet should include a CSS rule of the form:

    :host(:focus:not(.focus-ring)) {
      outline: none;
    }

**Returns**: <code>Class</code> - The extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | The base class to extend |

