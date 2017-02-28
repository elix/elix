# API Documentation
<a name="module_ChildrenContentMixin"></a>

## ChildrenContentMixin ⇒ <code>Class</code>
Mixin which defines a component's `symbols.content` property as all
child elements, including elements distributed to the component's slots.

This also provides notification of changes to a component's content. It
will invoke a `symbols.contentChanged` method when the component is first
instantiated, and whenever its distributed children change. This is intended
to satisfy the Gold Standard checklist item for monitoring
[Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).

Example:

```
let base = ChildrenContentMixin(DistributedChildrenMixin(HTMLElement));
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

Note that content change detection depends upon the element having at least
one `slot` element in its shadow subtree.

This mixin is intended for use with the
[DistributedChildrenMixin](DistributedChildrenMixin.md). See that mixin for
a discussion of how that works. This ChildrenContentMixin
provides an easy way of defining the "content" of a component as the
component's distributed children. That in turn lets mixins like
[ContentItemsMixin](ContentItemsMixin.md) manipulate the children as list
items.

To receive `contentChanged` notification, this mixin expects a component to
invoke a method called `symbols.shadowCreated` after the component's shadow
root has been created and populated.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [ChildrenContentMixin](#module_ChildrenContentMixin) ⇒ <code>Class</code>
    * [~ChildrenContent](#module_ChildrenContentMixin..ChildrenContent)
        * [.symbols.content](#module_ChildrenContentMixin..ChildrenContent+symbols.content) : <code>Array.&lt;HTMLElement&gt;</code>

<a name="module_ChildrenContentMixin..ChildrenContent"></a>

### ChildrenContentMixin~ChildrenContent
The class prototype added by the mixin.

  **Kind**: inner class of <code>[ChildrenContentMixin](#module_ChildrenContentMixin)</code>
<a name="module_ChildrenContentMixin..ChildrenContent+symbols.content"></a>

#### childrenContent.symbols.content : <code>Array.&lt;HTMLElement&gt;</code>
The content of this component, defined to be the flattened array of
children distributed to the component.

The default implementation of this property only returns instances of
Element

  **Kind**: instance property of <code>[ChildrenContent](#module_ChildrenContentMixin..ChildrenContent)</code>
