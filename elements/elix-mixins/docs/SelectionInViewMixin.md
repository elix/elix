# API Documentation
<a name="module_SelectinInViewMixin"></a>

## SelectinInViewMixin ⇒ <code>Class</code>
Mixin which scrolls a container horizontally and/or vertically to ensure that
a newly-selected item is visible to the user.

When the selected item in a list-like component changes, the selected item
should be brought into view so that the user can confirm their selection.

This mixin expects a `selectedItem` property to be set when the selection
changes. You can supply that yourself, or use
[SingleSelectionMixin](SingleSelectionMixin.md).

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [SelectinInViewMixin](#module_SelectinInViewMixin) ⇒ <code>Class</code>
    * [~SelectionInView](#module_SelectinInViewMixin..SelectionInView)
        * [.scrollItemIntoView(item)](#module_SelectinInViewMixin..SelectionInView+scrollItemIntoView)

<a name="module_SelectinInViewMixin..SelectionInView"></a>

### SelectinInViewMixin~SelectionInView
The class prototype added by the mixin.

  **Kind**: inner class of <code>[SelectinInViewMixin](#module_SelectinInViewMixin)</code>
<a name="module_SelectinInViewMixin..SelectionInView+scrollItemIntoView"></a>

#### selectionInView.scrollItemIntoView(item)
Scroll the given element completely into view, minimizing the degree of
scrolling performed.

Blink has a `scrollIntoViewIfNeeded()` function that does something
similar, but unfortunately it's non-standard, and in any event often ends
up scrolling more than is absolutely necessary.

This scrolls the containing element defined by the `scrollTarget`
property. See that property for a discussion of the default value of
that property.

  **Kind**: instance method of <code>[SelectionInView](#module_SelectinInViewMixin..SelectionInView)</code>

| Param | Type | Description |
| --- | --- | --- |
| item | <code>HTMLElement</code> | the item to scroll into view. |

