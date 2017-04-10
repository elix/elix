# API Documentation
<a name="defaultScrollTarget"></a>

## defaultScrollTarget(element) : <code>HTMLElement</code>
This helper returns a guess as to what portion of the given element can be
scrolled. This is used by [SelectionInViewMixin](SelectionInViewMixin) to
provide a default implementation of [symbols.scrollTarget].

If the element has a shadow root containing a default (unnamed) slot, this
returns the first ancestor of that slot that has either `overflow-x` or
`overflow-y` styled as `auto` or `scroll`. If the element has no default
slot, or no scrolling ancestor is found, the element itself is returned.

  **Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | – the component to examine for a scrolling element |

