# API Documentation
<a name="SimpleElement"></a>

## SimpleElement
A simple element

[Live demo](http://elix.org/elix/elements/elix-simple-element/)

This is a simple element.

  **Kind**: global class
**Mixes**: <code>[SimpleAttribute](../elix-mixins/docs/SimpleAttribute.md)</code>
  , <code>[SimpleTemplate](../elix-mixins/docs/SimpleTemplate.md)</code>
  

* [SimpleElement](#SimpleElement)
    * [.greeting](#SimpleElement+greeting) : <code>string</code>
    * [.reflectAttribute(attribute, value)](#SimpleAttribute+reflectAttribute)
    * [.reflectClass(className, value)](#SimpleTemplate+reflectClass)

<a name="SimpleElement+greeting"></a>

### simpleElement.greeting : <code>string</code>
Specifies the greeting.

  **Kind**: instance property of <code>[SimpleElement](#SimpleElement)</code>
**Default**: <code>&quot;greeting&quot;</code>  
<a name="SimpleAttribute+reflectAttribute"></a>

### simpleElement.reflectAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `reflectAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: instance method of <code>[SimpleElement](#SimpleElement)</code>. Defined by <code>[SimpleAttribute](../elix-mixins/docs/SimpleAttribute.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

<a name="SimpleTemplate+reflectClass"></a>

### simpleElement.reflectClass(className, value)
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`reflectClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: instance method of <code>[SimpleElement](#SimpleElement)</code>. Defined by <code>[SimpleTemplate](../elix-mixins/docs/SimpleTemplate.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| value | <code>object</code> | True to set the class, false to remove it. |

