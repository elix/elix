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

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [DefaultSlotContentMixin](#module_DefaultSlotContentMixin) ⇒ <code>Class</code>
    * [~DefaultSlotContent](#module_DefaultSlotContentMixin..DefaultSlotContent)
        * [.symbols.content](#module_DefaultSlotContentMixin..DefaultSlotContent+symbols.content) : <code>Array.&lt;HTMLElement&gt;</code>

<a name="module_DefaultSlotContentMixin..DefaultSlotContent"></a>

### DefaultSlotContentMixin~DefaultSlotContent
The class prototype added by the mixin.

  **Kind**: inner class of <code>[DefaultSlotContentMixin](#module_DefaultSlotContentMixin)</code>
<a name="module_DefaultSlotContentMixin..DefaultSlotContent+symbols.content"></a>

#### defaultSlotContent.symbols.content : <code>Array.&lt;HTMLElement&gt;</code>
The content of this component, defined to be the flattened set of
nodes assigned to its default unnamed slot.

  **Kind**: instance property of <code>[DefaultSlotContent](#module_DefaultSlotContentMixin..DefaultSlotContent)</code>
