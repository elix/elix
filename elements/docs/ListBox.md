# API Documentation
<a name="ListBox"></a>

## ListBox ⇐ <code>HTMLElement</code>
A simple single-selection list box.

This component supports a generic visual style, ARIA support, and full
keyboard navigation. See `KeyboardDirectionMixin`,
`KeyboardPagedSelectionMixin`, and `KeyboardPrefixSelectionMixin` for
keyboard details.

  **Kind**: global class
**Extends:** <code>HTMLElement</code>  
**Mixes**: <code>[AttributeMarshallingMixin](../../mixins/docs/AttributeMarshallingMixin.md)</code>
  , <code>[ClickSelectionMixin](../../mixins/docs/ClickSelectionMixin.md)</code>
  , <code>[ContentItemsMixin](../../mixins/docs/ContentItemsMixin.md)</code>
  , <code>[DefaultSlotContentMixin](../../mixins/docs/DefaultSlotContentMixin.md)</code>
  , <code>[DirectionSelectionMixin](../../mixins/docs/DirectionSelectionMixin.md)</code>
  , <code>[KeyboardDirectionMixin](../../mixins/docs/KeyboardDirectionMixin.md)</code>
  , <code>[KeyboardMixin](../../mixins/docs/KeyboardMixin.md)</code>
  , <code>[KeyboardPagedSelectionMixin](../../mixins/docs/KeyboardPagedSelectionMixin.md)</code>
  , <code>[KeyboardPrefixSelectionMixin](../../mixins/docs/KeyboardPrefixSelectionMixin.md)</code>
  , <code>[SelectedItemTextValueMixin](../../mixins/docs/SelectedItemTextValueMixin.md)</code>
  , <code>[SelectionAriaMixin](../../mixins/docs/SelectionAriaMixin.md)</code>
  , <code>[SelectionInViewMixin](../../mixins/docs/SelectionInViewMixin.md)</code>
  , <code>[ShadowTemplateMixin](../../mixins/docs/ShadowTemplateMixin.md)</code>
  , <code>[SingleSelectionMixin](../../mixins/docs/SingleSelectionMixin.md)</code>
  

* [ListBox](#ListBox) ⇐ <code>HTMLElement</code>
    * ["can-select-next-changed"](#SingleSelection.event_can-select-next-changed)
    * ["can-select-previous-changed"](#SingleSelection.event_can-select-previous-changed)
    * [.canSelectNext](#module_SingleSelectionMixin..SingleSelection+canSelectNext) : <code>boolean</code>
    * [.canSelectPrevious](#module_SingleSelectionMixin..SingleSelection+canSelectPrevious) : <code>boolean</code>
    * [.items](#module_ContentItemsMixin..ContentItems+items) : <code>Array.&lt;HTMLElement&gt;</code>
    * ["items-changed"](#ContentItems.event_items-changed)
    * [.orientation](#ListBox+orientation) : <code>string</code>
    * ["orientation-changed"](#ListBox.event_orientation-changed)
    * [.pageDown()](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageDown)
    * [.pageUp()](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageUp)
    * [.reflectAttribute(attribute, value)](#module_AttributeMarshallingMixin..AttributeMarshalling+reflectAttribute)
    * [.reflectClass(className, value)](#module_AttributeMarshallingMixin..AttributeMarshalling+reflectClass)
    * [.scrollItemIntoView(item)](#module_SelectinInViewMixin..SelectionInView+scrollItemIntoView)
    * ["selected-index-changed"](#SingleSelection.event_selected-index-changed)
    * ["selected-item-changed"](#SingleSelection.event_selected-item-changed)
    * [.selectedIndex](#module_SingleSelectionMixin..SingleSelection+selectedIndex) : <code>number</code>
    * [.selectedItem](#module_SingleSelectionMixin..SingleSelection+selectedItem) : <code>object</code>
    * [.selectFirst()](#module_SingleSelectionMixin..SingleSelection+selectFirst) ⇒ <code>Boolean</code>
    * [.selectionRequired](#module_SingleSelectionMixin..SingleSelection+selectionRequired) : <code>boolean</code>
    * [.selectionWraps](#module_SingleSelectionMixin..SingleSelection+selectionWraps) : <code>boolean</code>
    * [.selectItemWithTextPrefix(prefix)](#module_KeyboardPrefixSelectionMixin..KeyboardPrefixSelection+selectItemWithTextPrefix)
    * [.selectLast()](#module_SingleSelectionMixin..SingleSelection+selectLast) ⇒ <code>Boolean</code>
    * [.selectNext()](#module_SingleSelectionMixin..SingleSelection+selectNext) ⇒ <code>Boolean</code>
    * [.selectPrevious()](#module_SingleSelectionMixin..SingleSelection+selectPrevious) ⇒ <code>Boolean</code>
    * [.symbols.content](#module_DefaultSlotContentMixin..DefaultSlotContent+symbols.content) : <code>Array.&lt;HTMLElement&gt;</code>
    * [.symbols.goDown()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goDown)
    * [.symbols.goEnd()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goEnd)
    * [.symbols.goLeft()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goLeft)
    * [.symbols.goRight()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goRight)
    * [.symbols.goStart()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goStart)
    * [.symbols.goUp()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goUp)
    * [.symbols.itemAdded(item)](#module_SingleSelectionMixin..SingleSelection+symbols.itemAdded)
    * [.symbols.itemsChanged()](#module_ContentItemsMixin..ContentItems+symbols.itemsChanged)
    * [.symbols.itemSelected(item, selected)](#module_SingleSelectionMixin..SingleSelection+symbols.itemSelected)
    * [.symbols.keydown(event)](#module_KeyboardMixin..Keyboard+symbols.keydown) ⇒ <code>boolean</code>
    * [.value](#module_SelectedItemTextValueMixin..SelectedItemTextValue+value) : <code>string</code>

<a name="SingleSelection.event_can-select-next-changed"></a>

### "can-select-next-changed"
Fires when the canSelectNext property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[ListBox](#ListBox)</code>. Defined by <code>[SingleSelection](../mixins/docs/SingleSelection.md)</code> mixin.
<a name="SingleSelection.event_can-select-previous-changed"></a>

### "can-select-previous-changed"
Fires when the canSelectPrevious property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[ListBox](#ListBox)</code>. Defined by <code>[SingleSelection](../mixins/docs/SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+canSelectNext"></a>

### listBox.canSelectNext : <code>boolean</code>
True if the selection can be moved to the next item, false if not (the
selected item is the last item in the list).

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+canSelectPrevious"></a>

### listBox.canSelectPrevious : <code>boolean</code>
True if the selection can be moved to the previous item, false if not
(the selected item is the first one in the list).

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_ContentItemsMixin..ContentItems+items"></a>

### listBox.items : <code>Array.&lt;HTMLElement&gt;</code>
The current set of items in the list. See the top-level documentation for
mixin for a description of how items differ from plain content.

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:ContentItemsMixin~ContentItems](../mixins/docs/module:ContentItemsMixin~ContentItems.md)</code> mixin.
<a name="ContentItems.event_items-changed"></a>

### "items-changed"
Fires when the items in the list change.

  **Kind**: event emitted by <code>[ListBox](#ListBox)</code>. Defined by <code>[ContentItems](../mixins/docs/ContentItems.md)</code> mixin.
<a name="ListBox+orientation"></a>

### listBox.orientation : <code>string</code>
The vertical (default) or horizontal orientation of the list.

Supported values are "horizontal" or "vertical".

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>
<a name="ListBox.event_orientation-changed"></a>

### "orientation-changed"
Fires when the orientation property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[ListBox](#ListBox)</code>
<a name="module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageDown"></a>

### listBox.pageDown()
Scroll down one page.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardPagedSelectionMixin~KeyboardPagedSelection](../mixins/docs/module:KeyboardPagedSelectionMixin~KeyboardPagedSelection.md)</code> mixin.
<a name="module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageUp"></a>

### listBox.pageUp()
Scroll up one page.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardPagedSelectionMixin~KeyboardPagedSelection](../mixins/docs/module:KeyboardPagedSelectionMixin~KeyboardPagedSelection.md)</code> mixin.
<a name="module_AttributeMarshallingMixin..AttributeMarshalling+reflectAttribute"></a>

### listBox.reflectAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `reflectAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:AttributeMarshallingMixin~AttributeMarshalling](../mixins/docs/module:AttributeMarshallingMixin~AttributeMarshalling.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

<a name="module_AttributeMarshallingMixin..AttributeMarshalling+reflectClass"></a>

### listBox.reflectClass(className, value)
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`reflectClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:AttributeMarshallingMixin~AttributeMarshalling](../mixins/docs/module:AttributeMarshallingMixin~AttributeMarshalling.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| value | <code>object</code> | True to set the class, false to remove it. |

<a name="module_SelectinInViewMixin..SelectionInView+scrollItemIntoView"></a>

### listBox.scrollItemIntoView(item)
Scroll the given element completely into view, minimizing the degree of
scrolling performed.

Blink has a `scrollIntoViewIfNeeded()` function that does something
similar, but unfortunately it's non-standard, and in any event often ends
up scrolling more than is absolutely necessary.

This scrolls the containing element defined by the `scrollTarget`
property. See that property for a discussion of the default value of
that property.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SelectinInViewMixin~SelectionInView](../mixins/docs/module:SelectinInViewMixin~SelectionInView.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item to scroll into view. |

<a name="SingleSelection.event_selected-index-changed"></a>

### "selected-index-changed"
Fires when the selectedIndex property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[ListBox](#ListBox)</code>. Defined by <code>[SingleSelection](../mixins/docs/SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| detail.selectedIndex | <code>number</code> | The new selected index. |

<a name="SingleSelection.event_selected-item-changed"></a>

### "selected-item-changed"
Fires when the selectedItem property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[ListBox](#ListBox)</code>. Defined by <code>[SingleSelection](../mixins/docs/SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| detail.selectedItem | <code>HTMLElement</code> | The new selected item. |

<a name="module_SingleSelectionMixin..SingleSelection+selectedIndex"></a>

### listBox.selectedIndex : <code>number</code>
The index of the item which is currently selected.

The setter expects an integer or a string representing an integer.

A `selectedIndex` of -1 indicates there is no selection. Setting this
property to -1 will remove any existing selection.

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+selectedItem"></a>

### listBox.selectedItem : <code>object</code>
The currently selected item, or null if there is no selection.

Setting this property to null deselects any currently-selected item.
Setting this property to an object that is not in the list has no effect.

TODO: Even if selectionRequired, can still explicitly set selectedItem to null.
TODO: If selectionRequired, leave selection alone?

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+selectFirst"></a>

### listBox.selectFirst() ⇒ <code>Boolean</code>
Select the first item in the list.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectionRequired"></a>

### listBox.selectionRequired : <code>boolean</code>
True if the list should always have a selection (if it has items).

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Default**: <code>false</code>  
<a name="module_SingleSelectionMixin..SingleSelection+selectionWraps"></a>

### listBox.selectionWraps : <code>boolean</code>
True if selection navigations wrap from last to first, and vice versa.

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Default**: <code>false</code>  
<a name="module_KeyboardPrefixSelectionMixin..KeyboardPrefixSelection+selectItemWithTextPrefix"></a>

### listBox.selectItemWithTextPrefix(prefix)
Select the first item whose text content begins with the given prefix.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardPrefixSelectionMixin~KeyboardPrefixSelection](../mixins/docs/module:KeyboardPrefixSelectionMixin~KeyboardPrefixSelection.md)</code> mixin.

| Param | Description |
| --- | --- |
| prefix | [String] The prefix string to search for |

<a name="module_SingleSelectionMixin..SingleSelection+selectLast"></a>

### listBox.selectLast() ⇒ <code>Boolean</code>
Select the last item in the list.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectNext"></a>

### listBox.selectNext() ⇒ <code>Boolean</code>
Select the next item in the list.

If the list has no selection, the first item will be selected.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectPrevious"></a>

### listBox.selectPrevious() ⇒ <code>Boolean</code>
Select the previous item in the list.

If the list has no selection, the last item will be selected.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_DefaultSlotContentMixin..DefaultSlotContent+symbols.content"></a>

### listBox.symbols.content : <code>Array.&lt;HTMLElement&gt;</code>
The content of this component, defined to be the flattened set of
nodes assigned to its default unnamed slot.

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:DefaultSlotContentMixin~DefaultSlotContent](../mixins/docs/module:DefaultSlotContentMixin~DefaultSlotContent.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goDown"></a>

### listBox.symbols.goDown()
Invoked when the user wants to go/navigate down.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goEnd"></a>

### listBox.symbols.goEnd()
Invoked when the user wants to go/navigate to the end (e.g., of a list).
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goLeft"></a>

### listBox.symbols.goLeft()
Invoked when the user wants to go/navigate left.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goRight"></a>

### listBox.symbols.goRight()
Invoked when the user wants to go/navigate right.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goStart"></a>

### listBox.symbols.goStart()
Invoked when the user wants to go/navigate to the start (e.g., of a
list). The default implementation of this method does nothing.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goUp"></a>

### listBox.symbols.goUp()
Invoked when the user wants to go/navigate up.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemAdded"></a>

### listBox.symbols.itemAdded(item)
Handle a new item being added to the list.

The default implementation of this method simply sets the item's
selection state to false.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being added |

<a name="module_ContentItemsMixin..ContentItems+symbols.itemsChanged"></a>

### listBox.symbols.itemsChanged()
This method is invoked when the underlying contents change. It is also
invoked on component initialization – since the items have "changed" from
being nothing.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:ContentItemsMixin~ContentItems](../mixins/docs/module:ContentItemsMixin~ContentItems.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemSelected"></a>

### listBox.symbols.itemSelected(item, selected)
Apply the indicate selection state to the item.

The default implementation of this method does nothing. User-visible
effects will typically be handled by other mixins.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being selected/deselected |
| selected | <code>boolean</code> | true if the item is selected, false if not |

<a name="module_KeyboardMixin..Keyboard+symbols.keydown"></a>

### listBox.symbols.keydown(event) ⇒ <code>boolean</code>
Handle the indicated keyboard event.

The default implementation of this method does nothing. This will
typically be handled by other mixins.

  **Kind**: instance method of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:KeyboardMixin~Keyboard](../mixins/docs/module:KeyboardMixin~Keyboard.md)</code> mixin.
**Returns**: <code>boolean</code> - true if the event was handled  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>KeyboardEvent</code> | the keyboard event |

<a name="module_SelectedItemTextValueMixin..SelectedItemTextValue+value"></a>

### listBox.value : <code>string</code>
The text content of the selected item.

Setting this value to a string will attempt to select the first list item
whose text content match that string. Setting this to a string not matching
any list item will result in no selection.

  **Kind**: instance property of <code>[ListBox](#ListBox)</code>. Defined by <code>[module:SelectedItemTextValueMixin~SelectedItemTextValue](../mixins/docs/module:SelectedItemTextValueMixin~SelectedItemTextValue.md)</code> mixin.
