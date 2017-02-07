# API Documentation
<a name="module_KeyboardPagedSelectionMixin"></a>

## KeyboardPagedSelectionMixin ⇒ <code>Class</code>
Mixin which maps page keys (Page Up, Page Down) into operations that move
the selection by one page.

The keyboard interaction model generally follows that of Microsoft Windows'
list boxes instead of those in OS X:

* The Page Up/Down and Home/End keys actually change the selection, rather
  than just scrolling. The former behavior seems more generally useful for
  keyboard users.

* Pressing Page Up/Down will change the selection to the topmost/bottommost
  visible item if the selection is not already there. Thereafter, the key
  will move the selection up/down by a page, and (per the above point) make
  the selected item visible.

To ensure the selected item is in view following use of Page Up/Down, use
the related [SelectionInViewMixin](SelectionInViewMixin.md).

This mixin expects the component to provide:

* A `[symbols.keydown]` method invoked when a key is pressed. You can use
  [KeyboardMixin](KeyboardMixin.md) for that purpose, or wire up your own
  keyboard handling and call `[symbols.keydown]` yourself.
* A `selectedIndex` property that indicates the index of the selected item.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [KeyboardPagedSelectionMixin](#module_KeyboardPagedSelectionMixin) ⇒ <code>Class</code>
    * [~KeyboardPagedSelection](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection)
        * [.pageDown()](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageDown)
        * [.pageUp()](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageUp)

<a name="module_KeyboardPagedSelectionMixin..KeyboardPagedSelection"></a>

### KeyboardPagedSelectionMixin~KeyboardPagedSelection
The class prototype added by the mixin.

  **Kind**: inner class of <code>[KeyboardPagedSelectionMixin](#module_KeyboardPagedSelectionMixin)</code>

* [~KeyboardPagedSelection](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection)
    * [.pageDown()](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageDown)
    * [.pageUp()](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageUp)

<a name="module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageDown"></a>

#### keyboardPagedSelection.pageDown()
Scroll down one page.

  **Kind**: instance method of <code>[KeyboardPagedSelection](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection)</code>
<a name="module_KeyboardPagedSelectionMixin..KeyboardPagedSelection+pageUp"></a>

#### keyboardPagedSelection.pageUp()
Scroll up one page.

  **Kind**: instance method of <code>[KeyboardPagedSelection](#module_KeyboardPagedSelectionMixin..KeyboardPagedSelection)</code>
