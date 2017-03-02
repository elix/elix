# API Documentation
<a name="module_attributes"></a>

## attributes
Helpers for accessing a component's attributes.


* [attributes](#module_attributes)
    * [.setAttribute(attribute, value)](#module_attributes.setAttribute)
    * [.toggleClass(className, [value])](#module_attributes.toggleClass)
    * [.writePendingAttributes(element)](#module_attributes.writePendingAttributes)

<a name="module_attributes.setAttribute"></a>

### attributes.setAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `setAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: static method of <code>[attributes](#module_attributes)</code>

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

<a name="module_attributes.toggleClass"></a>

### attributes.toggleClass(className, [value])
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`toggleClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: static method of <code>[attributes](#module_attributes)</code>

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| [value] | <code>boolean</code> | True to set the class, false to remove it. If omitted, the class will be toggled. |

<a name="module_attributes.writePendingAttributes"></a>

### attributes.writePendingAttributes(element)
Perform any pending updates to attributes and classes.

This writes any `setAttribute` or `toggleClass` values that were performed
before an element was attached to the document for the first time.

This method should be called by mixins/components in their
`connectedCallback`. If mulitple mixins/components invoke this during the
same `connectedCallback`, only the first call will have any effect. The
subsequent calls will be harmless.

  **Kind**: static method of <code>[attributes](#module_attributes)</code>

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The element being added to the document. |

