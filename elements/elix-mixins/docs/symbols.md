# API Documentation
<a name="module_symbols"></a>

## symbols
A collection of (potentially polyfilled) Symbol objects for standard
component properties and methods.

These Symbol objects are used to allow mixins and a component to internally
communicate, without exposing these properties and methods in the component's
public API.

To use these Symbol objects in your own component, include this module and
then create a property or method whose key is the desired Symbol.

    import 'SingleSelectionMixin' from 'elix-mixins/src/SingleSelectionMixin';
    import 'symbols' from 'elix-mixins/src/symbols';

    class MyElement extends SingleSelectionMixin(HTMLElement) {
      [symbols.itemSelected](item, selected) {
        // This will be invoked whenever an item is selected/deselected.
      }
    }


* [symbols](#module_symbols)
    * [~defaults](#module_symbols..defaults) : <code>object</code>
    * [~itemAdded(item)](#module_symbols..itemAdded)
    * [~itemsChanged()](#module_symbols..itemsChanged)
    * [~itemSelected(item, selected)](#module_symbols..itemSelected)
    * [~raiseChangeEvents](#module_symbols..raiseChangeEvents) : <code>boolean</code>

<a name="module_symbols..defaults"></a>

### symbols~defaults : <code>object</code>
Symbol for the `defaults` property.

This property can be used to set or override defaults that will be applied
to a new component instance. When implementing this property, take care to
first acquire any defaults defined by the superclass. The standard idiom is
as follows:

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      // Set or override default values here
      defaults.customProperty = false;
      return defaults;
    }

  **Kind**: inner property of <code>[symbols](#module_symbols)</code>
<a name="module_symbols..itemAdded"></a>

### symbols~itemAdded(item)
Symbol for the `itemAdded` method.

This method is invoked when a new item is added to a list.

  **Kind**: inner method of <code>[symbols](#module_symbols)</code>

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being selected/deselected |

<a name="module_symbols..itemsChanged"></a>

### symbols~itemsChanged()
Symbol for the `itemsChanged` method.

This method is invoked when the underlying contents change. It is also
invoked on component initialization – since the items have "changed" from
being nothing.

  **Kind**: inner method of <code>[symbols](#module_symbols)</code>
<a name="module_symbols..itemSelected"></a>

### symbols~itemSelected(item, selected)
Symbol for the `itemSelected` method.

This method is invoked when an item becomes selected or deselected.

  **Kind**: inner method of <code>[symbols](#module_symbols)</code>

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being selected/deselected |
| selected | <code>boolean</code> | true if the item is selected, false if not |

<a name="module_symbols..raiseChangeEvents"></a>

### symbols~raiseChangeEvents : <code>boolean</code>
Symbol for the `raiseChangeEvents` property.

This property is used by mixins to determine whether they should raise
property change events. The standard HTML pattern is to only raise such
events in response to direct user interactions. For a detailed discussion
of this point, see the Gold Standard checklist item for
[Propery Change Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).

The above article describes a pattern for using a flag to track whether
work is being performed in response to internal component activity, and
whether the component should therefore raise property change events.
This `raiseChangeEvents` symbol is a shared flag used for that purpose by
all Elix mixins and components. Sharing this flag ensures that internal
activity (e.g., a UI event listener) in one mixin can signal other mixins
handling affected properties to raise change events.

All UI event listeners (and other forms of internal handlers, such as
timeouts and async network handlers) should set `raiseChangeEvents` to
`true` at the start of the event handler, then `false` at the end:

    this.addEventListener('click', event => {
      this[symbols.raiseChangeEvents] = true;
      // Do work here, possibly setting properties, like:
      this.foo = 'Hello';
      this[symbols.raiseChangeEvents] = false;
    });

Elsewhere, property setters that raise change events should only do so it
this property is `true`:

    set foo(value) {
      // Save foo value here, do any other work.
      if (this[symbols.raiseChangeEvents]) {
        const event = new CustomEvent('foo-changed');
        this.dispatchEvent(event);
      }
    }

In this way, programmatic attempts to set the `foo` property will not
trigger the `foo-changed` event, but UI interactions that update that
property will cause those events to be raised.

  **Kind**: inner property of <code>[symbols](#module_symbols)</code>
