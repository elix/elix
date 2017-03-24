# API Documentation
<a name="renderArrayAsElements"></a>

## renderArrayAsElements(items, container, renderItem)
Helper function for rendering an array of items as elements.

This is not a mixin, but a function components can use if they need to
generate a set of elements for the items in an array.

This function will reuse existing elements if possible. E.g., if it is called
to render an array of 4 items, and later called to render an array of 5
items, it can reuse the existing 4 items, creating just one new element.
Note, however, that this re-rendering is not automatic. If, after calling
this function, you manipulate the array you used, you must still call this
function again to re-render the array.

The `renderItem` parameter takes a function of two arguments: an item to
to render, and an existing element (if one exists) which can be repurposed to
render that item. If the latter argument is null, the `renderItem()` function
should create a new element and return it. The function should do the same
if the supplied existing element is not suitable for rendering the given
item; the returned element will be used to replace the existing one. If the
existing element *is* suitable, the function can simply update it and return
it as is.

Example: The following will render an array of strings in divs as children
of the `container` element:

    let strings = ['a', 'b', 'c', ...];
    let container = this.querySelector(...);
    renderArrayAsElements(strings, container, (string, element) => {
      if (!element || element.localName !== 'div') {
        // Create a new div.
        element = document.createElement('div');
      }
      // Set/update the text content of the element.
      element.textContent = string;
      return element;
    });

  **Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> | the items to render |
| container | <code>HTMLElement</code> | the parent that will hold the elements |
| renderItem | <code>function</code> | returns a new element for an item, or                                repurposes an existing element for an item |

