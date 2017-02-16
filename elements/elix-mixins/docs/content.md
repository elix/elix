# API Documentation
<a name="module_content"></a>

## content
Helpers for accessing a component's content.

The standard DOM API provides several ways of accessing child content:
`children`, `childNodes`, and `textContent`. None of these functions are
Shadow DOM aware. This mixin defines variations of those functions that
*are* Shadow DOM aware.

Example: you create a component `<count-children>` that displays a number
equal to the number of children placed inside that component. If someone
instantiates your component like:

    <count-children>
      <div></div>
      <div></div>
      <div></div>
    </count-children>

Then the component should show "3", because there are three children. To
calculate the number of children, the component can just calculate
`this.children.length`. However, suppose someone instantiates your
component inside one of their own components, and puts a `<slot>` element
inside your component:

    <count-children>
      <slot></slot>
    </count-children>

If your component only looks at `this.children`, it will always see exactly
one child — the `<slot>` element. But the user looking at the page will
*see* any nodes distributed to that slot. To match what the user sees, your
component should expand any `<slot>` elements it contains.

That is one problem these helpers solve. For example, the helper
`assignedChildren` will return all children assigned to your component in
the composed tree.


* [content](#module_content)
    * [.assignedChildNodes(element)](#module_content.assignedChildNodes) ⇒ <code>Array.&lt;Node&gt;</code>
    * [.assignedChildren(element)](#module_content.assignedChildren) ⇒ <code>Array.&lt;Element&gt;</code>
    * [.assignedTextContent(element)](#module_content.assignedTextContent) : <code>string</code>
    * [.filterAuxiliaryElements(elements)](#module_content.filterAuxiliaryElements) ⇒ <code>Array.&lt;Element&gt;</code>

<a name="module_content.assignedChildNodes"></a>

### content.assignedChildNodes(element) ⇒ <code>Array.&lt;Node&gt;</code>
An in-order collection of distributed child nodes, expanding any slot
elements. Like the standard `childNodes` property, this includes text and
other types of nodes.

  **Kind**: static method of <code>[content](#module_content)</code>
**Returns**: <code>Array.&lt;Node&gt;</code> - - the nodes assigned to the element  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | the element to inspect |

<a name="module_content.assignedChildren"></a>

### content.assignedChildren(element) ⇒ <code>Array.&lt;Element&gt;</code>
An in-order collection of distributed children, expanding any slot
elements. Like the standard `children` property, this skips text and other
node types which are not Element instances.

  **Kind**: static method of <code>[content](#module_content)</code>
**Returns**: <code>Array.&lt;Element&gt;</code> - - the children assigned to the element  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | the element to inspect |

<a name="module_content.assignedTextContent"></a>

### content.assignedTextContent(element) : <code>string</code>
The concatenated `textContent` of all distributed child nodes, expanding
any slot elements.

  **Kind**: static method of <code>[content](#module_content)</code>

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | the element to inspect |

<a name="module_content.filterAuxiliaryElements"></a>

### content.filterAuxiliaryElements(elements) ⇒ <code>Array.&lt;Element&gt;</code>
Return the given elements, filtering out auxiliary elements that aren't
typically visible. Given a `NodeList` or array of objects, it will only
return array members that are instances of `Element` (`HTMLElement` or
`SVGElement`), and not on a blacklist of normally invisible elements
(such as `style` or `script`).

  **Kind**: static method of <code>[content](#module_content)</code>
**Returns**: <code>Array.&lt;Element&gt;</code> - - the filtered elements  

| Param | Type | Description |
| --- | --- | --- |
| elements | <code>NodeList</code> &#124; <code>Array.&lt;Element&gt;</code> | the list of elements to filter |

