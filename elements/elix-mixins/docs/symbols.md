# API Documentation
<a name="module_symbols"></a>

## symbols
A collection of Symbol objects for standard component properties and methods.

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
    * [~itemSelected(item, selected)](#module_symbols..itemSelected)

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

<a name="module_symbols..itemSelected"></a>

### symbols~itemSelected(item, selected)
Symbol for the `itemSelected` method.

This method is invoked when an item becomes selected or deselected.

  **Kind**: inner method of <code>[symbols](#module_symbols)</code>

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being selected/deselected |
| selected | <code>boolean</code> | true if the item is selected, false if not |

