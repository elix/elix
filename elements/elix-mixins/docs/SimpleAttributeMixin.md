# API Documentation
<a name="module_SimpleAttributeMixin"></a>

## SimpleAttributeMixin ⇒ <code>Class</code>
Mixin which adds simplistic mapping of attributes to properties.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [SimpleAttributeMixin](#module_SimpleAttributeMixin) ⇒ <code>Class</code>
    * [~SimpleAttribute](#module_SimpleAttributeMixin..SimpleAttribute)
        * [.reflectAttribute(attribute, value)](#module_SimpleAttributeMixin..SimpleAttribute+reflectAttribute)

<a name="module_SimpleAttributeMixin..SimpleAttribute"></a>

### SimpleAttributeMixin~SimpleAttribute
The class prototype added by the mixin.

  **Kind**: inner class of <code>[SimpleAttributeMixin](#module_SimpleAttributeMixin)</code>
<a name="module_SimpleAttributeMixin..SimpleAttribute+reflectAttribute"></a>

#### simpleAttribute.reflectAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `reflectAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: instance method of <code>[SimpleAttribute](#module_SimpleAttributeMixin..SimpleAttribute)</code>

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

