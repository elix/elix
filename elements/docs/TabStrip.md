# API Documentation
<a name="TabStrip"></a>

## TabStrip ⇐ <code>HTMLElement</code>
A container for a set of tab buttons.

`TabStrip` is specifically responsible for handling keyboard navigation
between tab buttons, and for the visual layout of the buttons.

The user can select a tab with the mouse or touch, as well as by through the
keyboard. Each tab appears as a separate button in the tab order.
Additionally, if the focus is currently on a tab, the user can quickly
navigate between tabs with the left/right arrow keys (or, if the tabs are
in vertical position, the up/down arrow keys).

By default, the tabs are shown aligned to the left (in left-to-right
languages like English), where each tab is only as big as necessary. You
can adjust the alignment of the tabs with the `tabAlign` property.

The component assumes that the tab buttons will appear above the tab panels
they control. You can adjust that positioning with the `tabPosition`
property.

A `TabStrip` is often wrapped around a set of tab panels, a scenario which
can be handled with the separate [TabStripWrapper](TabStripWrapper.md)
component.

  **Kind**: global class
**Extends:** <code>HTMLElement</code>  
**Mixes**: <code>[AttributeMarshallingMixin](../elix-mixins/docs/AttributeMarshallingMixin.md)</code>
  , <code>[ClickSelectionMixin](../elix-mixins/docs/ClickSelectionMixin.md)</code>
  , <code>[DirectionSelectionMixin](../elix-mixins/docs/DirectionSelectionMixin.md)</code>
  , <code>[KeyboardMixin](../elix-mixins/docs/KeyboardMixin.md)</code>
  , <code>[KeyboardDirectionMixin](../elix-mixins/docs/KeyboardDirectionMixin.md)</code>
  , <code>[ShadowTemplateMixin](../elix-mixins/docs/ShadowTemplateMixin.md)</code>
  , <code>[SingleSelectionMixin](../elix-mixins/docs/SingleSelectionMixin.md)</code>
  

* [TabStrip](#TabStrip) ⇐ <code>HTMLElement</code>
    * ["can-select-next-changed"](#SingleSelection.event_can-select-next-changed)
    * ["can-select-previous-changed"](#SingleSelection.event_can-select-previous-changed)
    * [.canSelectNext](#module_SingleSelectionMixin..SingleSelection+canSelectNext) : <code>boolean</code>
    * [.canSelectPrevious](#module_SingleSelectionMixin..SingleSelection+canSelectPrevious) : <code>boolean</code>
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
    * [.symbols.goDown()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goDown)
    * [.symbols.goEnd()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goEnd)
    * [.symbols.goLeft()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goLeft)
    * [.symbols.goRight()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goRight)
    * [.symbols.goStart()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goStart)
    * [.symbols.goUp()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goUp)
    * [.symbols.itemAdded(item)](#module_SingleSelectionMixin..SingleSelection+symbols.itemAdded)
    * [.symbols.itemSelected(item, selected)](#module_SingleSelectionMixin..SingleSelection+symbols.itemSelected)
    * [.symbols.keydown(event)](#module_KeyboardMixin..Keyboard+symbols.keydown) ⇒ <code>boolean</code>
    * [.tabPosition](#TabStrip+tabPosition) : <code>string</code>

<a name="SingleSelection.event_can-select-next-changed"></a>

### "can-select-next-changed"
Fires when the canSelectNext property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[TabStrip](#TabStrip)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.
<a name="SingleSelection.event_can-select-previous-changed"></a>

### "can-select-previous-changed"
Fires when the canSelectPrevious property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[TabStrip](#TabStrip)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+canSelectNext"></a>

### tabStrip.canSelectNext : <code>boolean</code>
True if the selection can be moved to the next item, false if not (the
selected item is the last item in the list).

  **Kind**: instance property of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+canSelectPrevious"></a>

### tabStrip.canSelectPrevious : <code>boolean</code>
True if the selection can be moved to the previous item, false if not
(the selected item is the first one in the list).

  **Kind**: instance property of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_AttributeMarshallingMixin..AttributeMarshalling+reflectAttribute"></a>

### tabStrip.reflectAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `reflectAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:AttributeMarshallingMixin~AttributeMarshalling](../elix-mixins/docs/module:AttributeMarshallingMixin~AttributeMarshalling.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

<a name="module_AttributeMarshallingMixin..AttributeMarshalling+reflectClass"></a>

### tabStrip.reflectClass(className, value)
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`reflectClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:AttributeMarshallingMixin~AttributeMarshalling](../elix-mixins/docs/module:AttributeMarshallingMixin~AttributeMarshalling.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| value | <code>object</code> | True to set the class, false to remove it. |

<a name="SingleSelection.event_selected-index-changed"></a>

### "selected-index-changed"
Fires when the selectedIndex property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[TabStrip](#TabStrip)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| detail.selectedIndex | <code>number</code> | The new selected index. |

<a name="SingleSelection.event_selected-item-changed"></a>

### "selected-item-changed"
Fires when the selectedItem property changes in response to internal
component activity.

  **Kind**: event emitted by <code>[TabStrip](#TabStrip)</code>. Defined by <code>[SingleSelection](../elix-mixins/docs/SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| detail.selectedItem | <code>HTMLElement</code> | The new selected item. |

<a name="module_SingleSelectionMixin..SingleSelection+selectedIndex"></a>

### tabStrip.selectedIndex : <code>number</code>
The index of the item which is currently selected.

The setter expects an integer or a string representing an integer.

A `selectedIndex` of -1 indicates there is no selection. Setting this
property to -1 will remove any existing selection.

  **Kind**: instance property of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+selectedItem"></a>

### tabStrip.selectedItem : <code>object</code>
The currently selected item, or null if there is no selection.

Setting this property to null deselects any currently-selected item.
Setting this property to an object that is not in the list has no effect.

TODO: Even if selectionRequired, can still explicitly set selectedItem to null.
TODO: If selectionRequired, leave selection alone?

  **Kind**: instance property of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+selectFirst"></a>

### tabStrip.selectFirst() ⇒ <code>Boolean</code>
Select the first item in the list.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectionRequired"></a>

### tabStrip.selectionRequired : <code>boolean</code>
True if the list should always have a selection (if it has items).

  **Kind**: instance property of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Default**: <code>false</code>  
<a name="module_SingleSelectionMixin..SingleSelection+selectionWraps"></a>

### tabStrip.selectionWraps : <code>boolean</code>
True if selection navigations wrap from last to first, and vice versa.

  **Kind**: instance property of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Default**: <code>false</code>  
<a name="module_SingleSelectionMixin..SingleSelection+selectLast"></a>

### tabStrip.selectLast() ⇒ <code>Boolean</code>
Select the last item in the list.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectNext"></a>

### tabStrip.selectNext() ⇒ <code>Boolean</code>
Select the next item in the list.

If the list has no selection, the first item will be selected.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectPrevious"></a>

### tabStrip.selectPrevious() ⇒ <code>Boolean</code>
Select the previous item in the list.

If the list has no selection, the last item will be selected.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goDown"></a>

### tabStrip.symbols.goDown()
Invoked when the user wants to go/navigate down.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../elix-mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goEnd"></a>

### tabStrip.symbols.goEnd()
Invoked when the user wants to go/navigate to the end (e.g., of a list).
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../elix-mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goLeft"></a>

### tabStrip.symbols.goLeft()
Invoked when the user wants to go/navigate left.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../elix-mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goRight"></a>

### tabStrip.symbols.goRight()
Invoked when the user wants to go/navigate right.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../elix-mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goStart"></a>

### tabStrip.symbols.goStart()
Invoked when the user wants to go/navigate to the start (e.g., of a
list). The default implementation of this method does nothing.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../elix-mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goUp"></a>

### tabStrip.symbols.goUp()
Invoked when the user wants to go/navigate up.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:KeyboardDirectionMixin~KeyboardDirection](../elix-mixins/docs/module:KeyboardDirectionMixin~KeyboardDirection.md)</code> mixin.
<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemAdded"></a>

### tabStrip.symbols.itemAdded(item)
Handle a new item being added to the list.

The default implementation of this method simply sets the item's
selection state to false.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being added |

<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemSelected"></a>

### tabStrip.symbols.itemSelected(item, selected)
Apply the indicate selection state to the item.

The default implementation of this method does nothing. User-visible
effects will typically be handled by other mixins.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:SingleSelectionMixin~SingleSelection](../elix-mixins/docs/module:SingleSelectionMixin~SingleSelection.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being selected/deselected |
| selected | <code>boolean</code> | true if the item is selected, false if not |

<a name="module_KeyboardMixin..Keyboard+symbols.keydown"></a>

### tabStrip.symbols.keydown(event) ⇒ <code>boolean</code>
Handle the indicated keyboard event.

The default implementation of this method does nothing. This will
typically be handled by other mixins.

  **Kind**: instance method of <code>[TabStrip](#TabStrip)</code>. Defined by <code>[module:KeyboardMixin~Keyboard](../elix-mixins/docs/module:KeyboardMixin~Keyboard.md)</code> mixin.
**Returns**: <code>boolean</code> - true if the event was handled  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>KeyboardEvent</code> | the keyboard event |

<a name="TabStrip+tabPosition"></a>

### tabStrip.tabPosition : <code>string</code>
The position of the tab strip relative to the element's children. Valid
values are "top", "left", "right", and "bottom".

  **Kind**: instance property of <code>[TabStrip](#TabStrip)</code>
**Default**: <code>&quot;\&quot;top\&quot;&quot;</code>  
