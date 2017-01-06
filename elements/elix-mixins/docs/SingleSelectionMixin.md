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


* [SingleSelectionMixin](#module_SingleSelectionMixin) ⇒ <code>Class</code>
    * [~SingleSelection](#module_SingleSelectionMixin..SingleSelection)
        * [.canSelectNext](#module_SingleSelectionMixin..SingleSelection+canSelectNext) : <code>boolean</code>
        * [.canSelectPrevious](#module_SingleSelectionMixin..SingleSelection+canSelectPrevious) : <code>boolean</code>
        * [.selectedIndex](#module_SingleSelectionMixin..SingleSelection+selectedIndex) : <code>number</code>
        * [.selectedItem](#module_SingleSelectionMixin..SingleSelection+selectedItem) : <code>object</code>
        * [.selectFirst()](#module_SingleSelectionMixin..SingleSelection+selectFirst) ⇒ <code>Boolean</code>
        * [.selectionRequired](#module_SingleSelectionMixin..SingleSelection+selectionRequired) : <code>boolean</code>
        * [.selectionWraps](#module_SingleSelectionMixin..SingleSelection+selectionWraps) : <code>boolean</code>
        * [.selectLast()](#module_SingleSelectionMixin..SingleSelection+selectLast) ⇒ <code>Boolean</code>
        * [.selectNext()](#module_SingleSelectionMixin..SingleSelection+selectNext) ⇒ <code>Boolean</code>
        * [.selectPrevious()](#module_SingleSelectionMixin..SingleSelection+selectPrevious) ⇒ <code>Boolean</code>
        * [.symbols.itemAdded(item)](#module_SingleSelectionMixin..SingleSelection+symbols.itemAdded)
        * [.symbols.itemSelected(item, selected)](#module_SingleSelectionMixin..SingleSelection+symbols.itemSelected)

<a name="module_SingleSelectionMixin..SingleSelection"></a>

### SingleSelectionMixin~SingleSelection
The class prototype added by the mixin.

  **Kind**: inner class of <code>[SingleSelectionMixin](#module_SingleSelectionMixin)</code>

* [~SingleSelection](#module_SingleSelectionMixin..SingleSelection)
    * [.canSelectNext](#module_SingleSelectionMixin..SingleSelection+canSelectNext) : <code>boolean</code>
    * [.canSelectPrevious](#module_SingleSelectionMixin..SingleSelection+canSelectPrevious) : <code>boolean</code>
    * [.selectedIndex](#module_SingleSelectionMixin..SingleSelection+selectedIndex) : <code>number</code>
    * [.selectedItem](#module_SingleSelectionMixin..SingleSelection+selectedItem) : <code>object</code>
    * [.selectFirst()](#module_SingleSelectionMixin..SingleSelection+selectFirst) ⇒ <code>Boolean</code>
    * [.selectionRequired](#module_SingleSelectionMixin..SingleSelection+selectionRequired) : <code>boolean</code>
    * [.selectionWraps](#module_SingleSelectionMixin..SingleSelection+selectionWraps) : <code>boolean</code>
    * [.selectLast()](#module_SingleSelectionMixin..SingleSelection+selectLast) ⇒ <code>Boolean</code>
    * [.selectNext()](#module_SingleSelectionMixin..SingleSelection+selectNext) ⇒ <code>Boolean</code>
    * [.selectPrevious()](#module_SingleSelectionMixin..SingleSelection+selectPrevious) ⇒ <code>Boolean</code>
    * [.symbols.itemAdded(item)](#module_SingleSelectionMixin..SingleSelection+symbols.itemAdded)
    * [.symbols.itemSelected(item, selected)](#module_SingleSelectionMixin..SingleSelection+symbols.itemSelected)

<a name="module_SingleSelectionMixin..SingleSelection+canSelectNext"></a>

#### singleSelection.canSelectNext : <code>boolean</code>
True if the selection can be moved to the next item, false if not (the
selected item is the last item in the list).

  **Kind**: instance property of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
<a name="module_SingleSelectionMixin..SingleSelection+canSelectPrevious"></a>

#### singleSelection.canSelectPrevious : <code>boolean</code>
True if the selection can be moved to the previous item, false if not
(the selected item is the first one in the list).

  **Kind**: instance property of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
<a name="module_SingleSelectionMixin..SingleSelection+selectedIndex"></a>

#### singleSelection.selectedIndex : <code>number</code>
The index of the item which is currently selected.

The setter expects an integer or a string representing an integer.

A `selectedIndex` of -1 indicates there is no selection. Setting this
property to -1 will remove any existing selection.

  **Kind**: instance property of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
<a name="module_SingleSelectionMixin..SingleSelection+selectedItem"></a>

#### singleSelection.selectedItem : <code>object</code>
The currently selected item, or null if there is no selection.

Setting this property to null deselects any currently-selected item.
Setting this property to an object that is not in the list has no effect.

TODO: Even if selectionRequired, can still explicitly set selectedItem to null.
TODO: If selectionRequired, leave selection alone?

  **Kind**: instance property of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
<a name="module_SingleSelectionMixin..SingleSelection+selectFirst"></a>

#### singleSelection.selectFirst() ⇒ <code>Boolean</code>
Select the first item in the list.

  **Kind**: instance method of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectionRequired"></a>

#### singleSelection.selectionRequired : <code>boolean</code>
True if the list should always have a selection (if it has items).

  **Kind**: instance property of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
**Default**: <code>false</code>  
<a name="module_SingleSelectionMixin..SingleSelection+selectionWraps"></a>

#### singleSelection.selectionWraps : <code>boolean</code>
True if selection navigations wrap from last to first, and vice versa.

  **Kind**: instance property of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
**Default**: <code>false</code>  
<a name="module_SingleSelectionMixin..SingleSelection+selectLast"></a>

#### singleSelection.selectLast() ⇒ <code>Boolean</code>
Select the last item in the list.

  **Kind**: instance method of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectNext"></a>

#### singleSelection.selectNext() ⇒ <code>Boolean</code>
Select the next item in the list.

If the list has no selection, the first item will be selected.

  **Kind**: instance method of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+selectPrevious"></a>

#### singleSelection.selectPrevious() ⇒ <code>Boolean</code>
Select the previous item in the list.

If the list has no selection, the last item will be selected.

  **Kind**: instance method of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>
**Returns**: <code>Boolean</code> - True if the selection changed, false if not.  
<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemAdded"></a>

#### singleSelection.symbols.itemAdded(item)
Handle a new item being added to the list.

The default implementation of this method simply sets the item's
selection state to false.

  **Kind**: instance method of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being added |

<a name="module_SingleSelectionMixin..SingleSelection+symbols.itemSelected"></a>

#### singleSelection.symbols.itemSelected(item, selected)
Apply the indicate selection state to the item.

The default implementation of this method does nothing. User-visible
effects will typically be handled by other mixins.

  **Kind**: instance method of <code>[SingleSelection](#module_SingleSelectionMixin..SingleSelection)</code>

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item being selected/deselected |
| selected | <code>boolean</code> | true if the item is selected, false if not |

