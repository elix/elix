# API Documentation
<a name="module_ClickSelectionMixin"></a>

## ClickSelectionMixin ⇒ <code>Class</code>
Mixin which maps a click (actually, a mousedown) to an item selection.

This simple mixin is useful in list-like elements like [ListBox](ListBox),
where a click on a list item implicitly selects it.

The standard use for this mixin is in list-like elements. Native list
boxes don't appear to be consistent with regard to whether they select
on mousedown or click/mouseup. This mixin assumes the use of mousedown.
On touch devices, that event appears to trigger when the touch is *released*.

This mixin only listens to mousedown events for the primary mouse button
(typically the left button). Right-clicks are ignored so that the browser
may display a context menu.

Much has been written about how to ensure "fast tap" behavior on mobile
devices. This mixin makes a very straightforward use of a standard event, and
this appears to perform well on mobile devices when, e.g., the viewport is
configured with `width=device-width`.

This mixin expects the component to provide an `items` property. It also
expects the component to define a `selectedItem` property; you can provide
that yourself, or use [SingleSelectionMixin](SingleSelectionMixin).

If the component receives a clicks that doesn't correspond to an item (e.g.,
the user clicks on the element background visible between items), the
selection will be removed. However, if the component sets `selectionRequired`
to true, a background click will *not* remove the selection.

**Returns**: <code>Class</code> - The extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | The base class to extend |

