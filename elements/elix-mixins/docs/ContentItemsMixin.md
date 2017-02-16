# API Documentation
<a name="module_ContentItemsMixin"></a>

## ContentItemsMixin ⇒ <code>Class</code>
Mixin which maps content semantics (elements) to list item semantics.

Items differ from element contents in several ways:

* They are often referenced via index.
* They may have a selection state.
* It's common to do work to initialize the appearance or state of a new
  item.
* Auxiliary invisible child elements are filtered out and not counted as
  items. Auxiliary elements include link, script, style, and template
  elements. This filtering ensures that those auxiliary elements can be
  used in markup inside of a list without being treated as list items.

This mixin expects a component to provide a `content` property returning a
raw set of elements. You can provide that yourself, or use
[ChildrenContentMixin](ChildrenContentMixin.md).

[ChildrenContentMixin](ChildrenContentMixin.md), the
`contentChanged` method will be invoked for you when the element's children
care of notifying it of future changes, and turns on the optimization. With
change, turning on the optimization automatically.
method when the set of items changes, the mixin concludes that you'll take
property. To avoid having to do work each time that property is requested,
return that immediately on subsequent calls to the `items` property. If you
that on, the mixin saves a reference to the computed set of items, and will
The most commonly referenced property defined by this mixin is the `items`
this mixin supports an optimized mode. If you invoke the `contentChanged`
use this mixin in conjunction with

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [ContentItemsMixin](#module_ContentItemsMixin) ⇒ <code>Class</code>
    * [~ContentItems](#module_ContentItemsMixin..ContentItems)
        * [.items](#module_ContentItemsMixin..ContentItems+items) : <code>Array.&lt;HTMLElement&gt;</code>
        * [.symbols.itemsChanged()](#module_ContentItemsMixin..ContentItems+symbols.itemsChanged)
        * [.symbols.itemSelected(item, selected)](#module_ContentItemsMixin..ContentItems+symbols.itemSelected)

<a name="module_ContentItemsMixin..ContentItems"></a>

### ContentItemsMixin~ContentItems
The class prototype added by the mixin.

  **Kind**: inner class of <code>[ContentItemsMixin](#module_ContentItemsMixin)</code>

* [~ContentItems](#module_ContentItemsMixin..ContentItems)
    * [.items](#module_ContentItemsMixin..ContentItems+items) : <code>Array.&lt;HTMLElement&gt;</code>
    * [.symbols.itemsChanged()](#module_ContentItemsMixin..ContentItems+symbols.itemsChanged)
    * [.symbols.itemSelected(item, selected)](#module_ContentItemsMixin..ContentItems+symbols.itemSelected)

<a name="module_ContentItemsMixin..ContentItems+items"></a>

#### contentItems.items : <code>Array.&lt;HTMLElement&gt;</code>
The current set of items in the list. See the top-level documentation for
mixin for a description of how items differ from plain content.

  **Kind**: instance property of <code>[ContentItems](#module_ContentItemsMixin..ContentItems)</code>
<a name="module_ContentItemsMixin..ContentItems+symbols.itemsChanged"></a>

#### contentItems.symbols.itemsChanged()
This method is invoked when the underlying contents change. It is also
invoked on component initialization – since the items have "changed" from
being nothing.

  **Kind**: instance method of <code>[ContentItems](#module_ContentItemsMixin..ContentItems)</code>
<a name="module_ContentItemsMixin..ContentItems+symbols.itemSelected"></a>

#### contentItems.symbols.itemSelected(item, selected)
The selection state for a single item has changed.

Invoke this method to signal that the selected state of the indicated item
has changed. By default, this applies a `selected` CSS class if the item
is selected, and removed it if not selected.

  **Kind**: instance method of <code>[ContentItems](#module_ContentItemsMixin..ContentItems)</code>

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | The item whose selection state has changed. |
| selected | <code>boolean</code> | True if the item is selected, false if not. |

