# API Documentation
<a name="module_ContentItemsMixin"></a>

## ContentItemsMixin ⇒ <code>Class</code>
Mixin which maps content semantics (nodes) to list item semantics.

Items differ from nodes contents in several ways:

* They are often referenced via index.
* They may have a selection state.
* It's common to do work to initialize the appearance or state of a new
  item.
* Text nodes are filtered out.
* Auxiliary invisible child elements are filtered out and not counted as
  items. Auxiliary elements include link, script, style, and template
  elements. This filtering ensures that those auxiliary elements can be
  used in markup inside of a list without being treated as list items.

This mixin expects a component to provide a `content` property returning a
raw set of elements. You can provide that yourself, or use
[DefaultSlotContentMixin](DefaultSlotContentMixin.md).

The most commonly referenced property defined by this mixin is the `items`
property. To avoid having to do work each time that property is requested,
this mixin supports an optimized mode. If you invoke the `contentChanged`
method when the set of items changes, the mixin concludes that you'll take
care of notifying it of future changes, and turns on the optimization. With
that on, the mixin saves a reference to the computed set of items, and will
return that immediately on subsequent calls to the `items` property. If you
use this mixin in conjunction with `DefaultSlotContentMixin`, the
`contentChanged` method will be invoked for you when the element's children
change, turning on the optimization automatically.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [ContentItemsMixin](#module_ContentItemsMixin) ⇒ <code>Class</code>
    * [~ContentItems](#module_ContentItemsMixin..ContentItems)
        * [.items](#module_ContentItemsMixin..ContentItems+items) : <code>Array.&lt;HTMLElement&gt;</code>
        * [.symbols.itemsChanged()](#module_ContentItemsMixin..ContentItems+symbols.itemsChanged)

<a name="module_ContentItemsMixin..ContentItems"></a>

### ContentItemsMixin~ContentItems
The class prototype added by the mixin.

  **Kind**: inner class of <code>[ContentItemsMixin](#module_ContentItemsMixin)</code>

* [~ContentItems](#module_ContentItemsMixin..ContentItems)
    * [.items](#module_ContentItemsMixin..ContentItems+items) : <code>Array.&lt;HTMLElement&gt;</code>
    * [.symbols.itemsChanged()](#module_ContentItemsMixin..ContentItems+symbols.itemsChanged)

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
