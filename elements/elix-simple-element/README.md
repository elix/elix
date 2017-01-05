# API Documentation
<a name="module_SimpleElement"></a>

## SimpleElement
A simple element used to demonstrate the build and documentation process.

[Live demo](http://elix.org/elix/elements/elix-simple-element/)

**Mixes**: <code>[SimpleAttributeMixin](../elix-mixins/docs/SimpleAttributeMixin.md)</code>
  , <code>[SimpleTemplateMixin](../elix-mixins/docs/SimpleTemplateMixin.md)</code>
  

* [SimpleElement](#module_SimpleElement)
    * [.reflectAttribute(attribute, value)](#module_SimpleAttributeMixin..SimpleAttribute+reflectAttribute)
    * [.reflectClass(className, value)](#module_SimpleTemplateMixin..SimpleTemplate+reflectClass)
    * [~SimpleAttribute](#module_SimpleAttributeMixin..SimpleAttribute)
    * [~SimpleTemplate](#module_SimpleTemplateMixin..SimpleTemplate)

<a name="module_SimpleAttributeMixin..SimpleAttribute+reflectAttribute"></a>

### simpleElement.reflectAttribute(attribute, value)
Set/unset the attribute with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as an attribute. An
important limitation of custom element consturctors is that they cannot
set attributes. A call to `reflectAttribute` during the constructor will
be deferred until the element is connected to the document.

  **Kind**: instance method of <code>[SimpleElement](#module_SimpleElement)</code>. Defined by <code>[module:SimpleAttributeMixin~SimpleAttribute](../elix-mixins/docs/module:SimpleAttributeMixin~SimpleAttribute.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the *attribute* (not property) to set. |
| value | <code>object</code> | The value to set. If null, the attribute will be removed. |

<a name="module_SimpleTemplateMixin..SimpleTemplate+reflectClass"></a>

### simpleElement.reflectClass(className, value)
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`reflectClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: instance method of <code>[SimpleElement](#module_SimpleElement)</code>. Defined by <code>[module:SimpleTemplateMixin~SimpleTemplate](../elix-mixins/docs/module:SimpleTemplateMixin~SimpleTemplate.md)</code> mixin.

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| value | <code>object</code> | True to set the class, false to remove it. |

<a name="module_SimpleAttributeMixin..SimpleAttribute"></a>

### SimpleElement~SimpleAttribute
The class prototype added by the mixin.

  **Kind**: inner class of <code>[SimpleElement](#module_SimpleElement)</code>. Defined by <code>[module:SimpleAttributeMixin](../elix-mixins/docs/module:SimpleAttributeMixin.md)</code> mixin.
<a name="module_SimpleTemplateMixin..SimpleTemplate"></a>

### SimpleElement~SimpleTemplate
The class prototype added by the mixin.

  **Kind**: inner class of <code>[SimpleElement](#module_SimpleElement)</code>. Defined by <code>[module:SimpleTemplateMixin](../elix-mixins/docs/module:SimpleTemplateMixin.md)</code> mixin.
