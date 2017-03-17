# API Documentation
<a name="module_SelectedItemTextValueMixin"></a>

## SelectedItemTextValueMixin ⇒ <code>Class</code>
Mixin which defines a `value` property that reflects the text content of a
selected item.

This mixin exists for list-like components that want to provide a more
convenient way to get/set the selected item using text.

This mixin expects a component to provide an `items` array of all elements
in the list. A standard way to do that with is
[ContentItemsMixin](ContentItemsMixin.md). This also expects the definition
of `selectedIndex` and `selectedItem` properties, which can be obtained
from [SingleSelectionMixin](SingleSelectionMixin.md).

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

