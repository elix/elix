# API Documentation
<a name="Modes"></a>

## Modes ⇐ <code>HTMLElement</code>
Shows exactly one child element at a time. This can be useful, for example,
if a given UI element has multiple modes that present substantially different
elements.

This component doesn't provide any UI for changing which mode is shown. A
common pattern in which buttons select the mode are tabs, a pattern
implemented by the [Tabs](Tabs.md) component.

  **Kind**: global class
**Extends:** <code>HTMLElement</code>  
**Mixes**: <code>[AttributeMarshallingMixin](../elix-mixins/docs/AttributeMarshallingMixin.md)</code>
  , <code>[ContentItemsMixin](../elix-mixins/docs/ContentItemsMixin.md)</code>
  , <code>[DefaultSlotContentMixin](../elix-mixins/docs/DefaultSlotContentMixin.md)</code>
  , <code>[SingleSelectionMixin](../elix-mixins/docs/SingleSelectionMixin.md)</code>
  

* [Modes](#Modes) ⇐ <code>HTMLElement</code>
    * ["can-select-next-changed"](#SingleSelection.event_can-select-next-changed)
    * ["can-select-previous-changed"](#SingleSelection.event_can-select-previous-changed)
    * [.canSelectNext](#module_SingleSelectionMixin..SingleSelection+canSelectNext) : <code>boolean</code>
    * [.canSelectPrevious](#module_SingleSelectionMixin..SingleSelection+canSelectPrevious) : <code>boolean</code>
    * [.items](#module_ContentItemsMixin..ContentItems+items) : <code>Array.&lt;HTMLElement&gt;</code>
    * ["items-changed"](#ContentItems.event_items-changed)
    * [.reflectAttribute(attribute, value)](#module_AttributeMarshallingMixin..AttributeMarshalling+reflectAttribute)
    * [.reflectClass(className, value)](#module_AttributeMarshallingMixin..AttributeMarshalling+reflectClass)
    * ["selected-index-changed"](#SingleSelection.event_selected-index-changed)
    * ["selected-item-changed"](#SingleSelection.event_selected-item-changed)
    * [.selectedIndex](#module_SingleSelectionMixin..SingleSelection+selectedIndex) : <code>number</code>
    * [.selectedItem](#module_SingleSelectionMixin..SingleSelection+selectedItem) : <code>object</code>
    * [.selectFirst()](#module_SingleSelectionMixin..SingleSelection+selectFirst) ⇒ <code>Boolean</code>
    * [.selectionRequired](#module_SingleSelectionMixin..SingleSelection+selectionRequired) : <code>boolean</code>
    * [.selectionWraps](#module_SingleSelectionMixin..SingleSelection+selectionWraps) : <code>boolean</code>
    * [.selectLast()](#module_SingleSelectionMixin..SingleSelection+selectLast) ⇒ <code>Boolean</code>
    * [.selectNext()](#module_SingleSelectionMixin..SingleSelection+selectNext) ⇒ <code>Boolean</code>
    * [.selectPrevious()](#module_SingleSelectionMixin..SingleSelection+selectPrevious) ⇒ <code>Boolean</code>
    * [.symbols.content](#module_DefaultSlotContentMixin..DefaultSlotContent+symbols.content) : <code>Array.&lt;HTMLElement&gt;</code>
    * [.symbols.itemAdded(item)](#module_SingleSelectionMixin..SingleSelection+symbols.itemAdded)
    * [.symbols.itemsChanged()](#module_ContentItemsMixin..ContentItems+symbols.itemsChanged)
    * [.symbols.itemSelected(item, selected)](#module_SingleSelectionMixin..SingleSelection+symbols.itemSelected)

<a name="SingleSelection.event_can-select-next-changed"></a>

### "can-select-next-changed"
Fires when the canSelectNext property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[Modes](#Modes)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.
<a name="SingleSelection.event_can-select-previous-changed"></a>

### "can-select-previous-changed"
Fires when the canSelectPrevious property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[Modes](#Modes)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+canSelectNext"></a>

### modes.canSelectNext : <code>boolean</code>
True if the selection can be moved to the next item, false if not (the
selected item is the last item in the list).

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+canSelectPrevious"></a>

### modes.canSelectPrevious : <code>boolean</code>
True if the selection can be moved to the previous item, false if not
(the selected item is the first one in the list).

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_ContentItemsMixin..ContentItems+items"></a>

### modes.items : <code>Array.&lt;HTMLElement&gt;</code>
The current set of items in the list. See the top-level documentation for
mixin for a description of how items differ from plain content.

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:ContentItemsMixin~ContentItems](../elix-mixins/docs/module:ContentItemsMixin~ContentItems.md)</code> mixin.
<a name="ContentItems.event_items-changed"></a>

### "items-changed"
Fires when the items in the list change.

  **Kind**: event emitted by <code>[Modes](#Modes)</code>. Defined by <code>[ContentItems](../elix-mixins/docs/ContentItems.md)</code> mixin.
<a name="module_AttributeMarshallingMixin..AttributeMarshalling+reflectAttribute"></a>

### modes.reflectAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `reflectAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:AttributeMarshallingMixin~AttributeMarshalling](../elix-mixins/docs/module:AttributeMarshallingMixin~AttributeMarshalling.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

<a name="module_AttributeMarshallingMixin..AttributeMarshalling+reflectClass"></a>

### modes.reflectClass(className, value)
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`reflectClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:AttributeMarshallingMixin~AttributeMarshalling](../elix-mixins/docs/module:AttributeMarshallingMixin~AttributeMarshalling.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| value | <code>object</code> | True to set the class, false to remove it. |

<a name="SingleSelection.event_selected-index-changed"></a>

### "selected-index-changed"
Fires when the selectedIndex property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[Modes](#Modes)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| detail.selectedIndex | <code>number</code> | The new selected index. |

<a name="SingleSelection.event_selected-item-changed"></a>

### "selected-item-changed"
Fires when the selectedItem property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[Modes](#Modes)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| detail.selectedItem | <code>HTMLElement</code> | The new selected item. |

<a name="module_SingleSelectionMixin..SingleSelection+selectedIndex"></a>

### modes.selectedIndex : <code>number</code>
The index of the item which is currently selected.

The setter expects an integer or a string representing an integer.

A `selectedIndex` of -1 indicates there is no selection. Setting this
property to -1 will remove any existing selection.

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+selectedItem"></a>

### modes.selectedItem : <code>object</code>
The currently selected item, or null if there is no selection.

Setting this property to null deselects any currently-selected item.
Setting this property to an object that is not in the list has no effect.

TODO: Even if selectionRequired, can still explicitly set selectedItem to null.
TODO: If selectionRequired, leave selection alone?

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+selectFirst"></a>

### modes.selectFirst() ⇒ <code>Boolean</code>
Select the first item in the list.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectionRequired"></a>

### modes.selectionRequired : <code>boolean</code>
True if the list should always have a selection (if it has items).

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Default**: <code>false</code>  
<a name="module_SingleSelectionMixin..SingleSelection+selectionWraps"></a>

### modes.selectionWraps : <code>boolean</code>
True if selection navigations wrap from last to first, and vice versa.

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Default**: <code>false</code>  
<a name="module_SingleSelectionMixin..SingleSelection+selectLast"></a>

### modes.selectLast() ⇒ <code>Boolean</code>
Select the last item in the list.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectNext"></a>

### modes.selectNext() ⇒ <code>Boolean</code>
Select the next item in the list.

If the list has no selection, the first item will be selected.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectPrevious"></a>

### modes.selectPrevious() ⇒ <code>Boolean</code>
Select the previous item in the list.

If the list has no selection, the last item will be selected.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_DefaultSlotContentMixin..DefaultSlotContent+symbols.content"></a>

### modes.symbols.content : <code>Array.&lt;HTMLElement&gt;</code>
The content of this component, defined to be the flattened set of
nodes assigned to its default unnamed slot.

  **Kind**: instance property of <code>[Modes](#Modes)</code>. Defined by <code>[module:DefaultSlotContentMixin~DefaultSlotContent](../elix-mixins/docs/module:DefaultSlotContentMixin~DefaultSlotContent.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemAdded"></a>

### modes.symbols.itemAdded(item)
Handle a new item being added to the list.

The default implementation of this method simply sets the item's
selection state to false.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being added |

<a name="module_ContentItemsMixin..ContentItems+symbols.itemsChanged"></a>

### modes.symbols.itemsChanged()
This method is invoked when the underlying contents change. It is also
invoked on component initialization – since the items have "changed" from
being nothing.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:ContentItemsMixin~ContentItems](../elix-mixins/docs/module:ContentItemsMixin~ContentItems.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemSelected"></a>

### modes.symbols.itemSelected(item, selected)
Apply the indicate selection state to the item.

The default implementation of this method does nothing. User-visible
effects will typically be handled by other mixins.

  **Kind**: instance method of <code>[Modes](#Modes)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being selected/deselected |
| selected | <code>boolean</code> | true if the item is selected, false if not |

