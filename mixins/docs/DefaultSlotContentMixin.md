# API Documentation
<a name="module_DefaultSlotContentMixin"></a>

## DefaultSlotContentMixin ⇒ <code>Class</code>
Mixin which defines a component's `symbols.content` property as the flattened
set of nodes assigned to its default slot.

This also provides notification of changes to a component's content. It
will invoke a `symbols.contentChanged` method when the component is first
instantiated, and whenever its distributed children change. This is intended
to satisfy the Gold Standard checklist item for monitoring
[Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).

Example:

```
let base = DefaultSlotContentMixin(HTMLElement);
class CountingElement extends base {

  constructor() {
    super();
    let root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<slot></slot>`;
    this[symbols.shadowCreated]();
  }

  [symbols.contentChanged]() {
    if (super[symbols.contentChanged]) { super[symbols.contentChanged](); }
    // Count the component's children, both initially and when changed.
    this.count = this.distributedChildren.length;
  }

}
```

To use this mixin, the component should define a default (unnamed) `slot`
element in its shadow subtree.

To receive `contentChanged` notification, this mixin expects a component to
invoke a method called `symbols.shadowCreated` after the component's shadow
root has been created and populated.

**Returns**: <code>Class</code> - The extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | The base class to extend |

