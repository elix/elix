# API Documentation
<a name="module_ShadowReferencesMixin"></a>

## ShadowReferencesMixin ⇒ <code>Class</code>
This mixin creates references to elements in a component's Shadow DOM subtree.

This adds a member on the component called `this.$` that can be used to
reference shadow elements with IDs. E.g., if component's shadow contains an
element `<button id="foo">`, then this mixin will create a member
`this.$.foo` that points to that button.

Such references simplify a component's access to its own elements. In
exchange, this mixin trades off a one-time cost of querying all elements in
the shadow tree instead of paying an ongoing cost to query for an element
each time the component wants to inspect or manipulate it.

This mixin expects the component to define a Shadow DOM subtree and, when
that has been done, to invoke [symbols.shadowCreated](symbols#shadowCreated).
You can create the shadow subtree yourself, or make use of
[ShadowTemplateMixin](ShadowTemplateMixin).

This mixin is inspired by Polymer's [automatic
node finding](https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding)
feature.

**Returns**: <code>Class</code> - The extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | The base class to extend |

<a name="module_ShadowReferencesMixin..$"></a>

### ShadowReferencesMixin~$ : <code>object</code>
The collection of references to the elements with IDs in a component's
Shadow DOM subtree.

  **Kind**: inner property of <code>[ShadowReferencesMixin](#module_ShadowReferencesMixin)</code>
