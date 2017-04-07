# API Documentation
<a name="module_SingleSelectionMixin"></a>

## SingleSelectionMixin ⇒ <code>Class</code>
Mixin which adds single-selection semantics for items in a list.

This mixin expects a component to provide an `items` Array or NodeList of
all elements in the list.

This mixin tracks a single selected item in the list, and provides means to
get and set that state by item position (`selectedIndex`) or item identity
(`selectedItem`). The selection can be moved in the list via the methods
`selectFirst`, `selectLast`, `selectNext`, and `selectPrevious`.

This mixin does not produce any user-visible effects to represent
selection.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

