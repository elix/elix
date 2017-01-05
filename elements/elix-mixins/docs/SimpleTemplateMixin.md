# API Documentation
<a name="module_SimpleTemplateMixin"></a>

## SimpleTemplateMixin ⇒ <code>Class</code>
Mixin which adds a simplistic means of cloning a string template into a new
shadow root.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |


* [SimpleTemplateMixin](#module_SimpleTemplateMixin) ⇒ <code>Class</code>
    * [~SimpleTemplate](#module_SimpleTemplateMixin..SimpleTemplate)
        * [.reflectClass(className, value)](#module_SimpleTemplateMixin..SimpleTemplate+reflectClass)

<a name="module_SimpleTemplateMixin..SimpleTemplate"></a>

### SimpleTemplateMixin~SimpleTemplate
The class prototype added by the mixin.

  **Kind**: inner class of <code>[SimpleTemplateMixin](#module_SimpleTemplateMixin)</code>
<a name="module_SimpleTemplateMixin..SimpleTemplate+reflectClass"></a>

#### simpleTemplate.reflectClass(className, value)
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`reflectClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: instance method of <code>[SimpleTemplate](#module_SimpleTemplateMixin..SimpleTemplate)</code>

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| value | <code>object</code> | True to set the class, false to remove it. |

