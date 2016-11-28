# API Documentation
<a name="SimpleAttribute"></a>

## SimpleAttribute
Simple mixin for having attribute changes update properties.

  **Kind**: global class
<a name="SimpleAttribute+reflectAttribute"></a>

### simpleAttribute.reflectAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `reflectAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: instance method of <code>[SimpleAttribute](#SimpleAttribute)</code>

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

