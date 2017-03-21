# API Documentation
<a name="module_KeyboardMixin"></a>

## KeyboardMixin ⇒ <code>Class</code>
Mixin which manages the keydown handling for a component.

This mixin handles several keyboard-related features.

First, it wires up a single keydown event handler that can be shared by
multiple mixins on a component. The event handler will invoke a `keydown`
method with the event object, and any mixin along the prototype chain that
wants to handle that method can do so.

If a mixin wants to indicate that keyboard event has been handled, and that
other mixins should *not* handle it, the mixin's `keydown` handler should
return a value of true. The convention that seems to work well is that a
mixin should see if it wants to handle the event and, if not, then ask the
superclass to see if it wants to handle the event. This has the effect of
giving the mixin that was applied last the first chance at handling a
keyboard event.

Example:

    [symbols.keydown](event) {
      let handled;
      switch (event.keyCode) {
        // Handle the keys you want, setting handled = true if appropriate.
      }
      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event));
    }

Until iOS Safari supports the `KeyboardEvent.key` property
(see http://caniuse.com/#search=keyboardevent.key), mixins should generally
test keys using the legacy `keyCode` property, not `key`.

A second feature provided by this mixin is that it implicitly makes the
component a tab stop if it isn't already, by setting `tabIndex` to 0. This
has the effect of adding the component to the tab order in document order.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

