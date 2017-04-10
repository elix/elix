# API Documentation
<a name="module_SelectinInViewMixin"></a>

## SelectinInViewMixin ⇒ <code>Class</code>
Mixin which scrolls a container horizontally and/or vertically to ensure that
a newly-selected item is visible to the user.

When the selected item in a list-like component changes, the selected item
should be brought into view so that the user can confirm their selection.

This mixin expects a `selectedItem` property to be set when the selection
changes. You can supply that yourself, or use
[SingleSelectionMixin](SingleSelectionMixin).

**Returns**: <code>Class</code> - The extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | The base class to extend |

