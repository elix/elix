# API Documentation
<a name="module_content"></a>

## content
These functions help access component content.

<a name="module_content.substantiveElements"></a>

### content.substantiveElements(nodes) ⇒ <code>Array.&lt;Element&gt;</code>
Return a set of Elements which are likely to be useful as component content.

Given a `NodeList` or array of objects, this will return only those array
members that are: a) instances of `Element` (`HTMLElement` or `SVGElement`),
and b) not on a blacklist of normally invisible elements (such as `style` or
`script`). Among other things, this filters out Text nodes.

This is used by [ContentItemsMixin](ContentItemsMixin) to filter out nodes
which are unlikely to be interesting as list items.

  **Kind**: static method of <code>[content](#module_content)</code>
**Returns**: <code>Array.&lt;Element&gt;</code> - the filtered elements  

| Param | Type | Description |
| --- | --- | --- |
| nodes | <code>NodeList</code> &#124; <code>Array.&lt;Node&gt;</code> | the list of nodes to filter |

