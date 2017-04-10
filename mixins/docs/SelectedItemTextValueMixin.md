# API Documentation
<a name="module_SelectedItemTextValueMixin"></a>

## SelectedItemTextValueMixin ⇒ <code>Class</code>
Mixin which defines a `value` property that reflects the text content of a
selected item.

This mixin exists for list-like components that want to provide a more
convenient way to get/set the selected item using text. It adds a `value`
property that gets the `textContent` of a component's `selectedItem`. The
`value` property can also be set to set the selection to the first item in
the `items` collection that has the requested `textContent`. If the indicated
text is not found in `items`, the selection is cleared.

This mixin expects a component to provide an `items` array of all elements
in the list. A standard way to do that with is
[ContentItemsMixin](ContentItemsMixin). This also expects the definition
of `selectedIndex` and `selectedItem` properties, which can be obtained
from [SingleSelectionMixin](SingleSelectionMixin).

An example of an element using `SelectedItemTextValueMixin` is
[ListBox](ListBox).

**Returns**: <code>Class</code> - The extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | The base class to extend |

