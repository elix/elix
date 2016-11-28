# API Documentation
<a name="SimpleTemplate"></a>

## SimpleTemplate
Simple mixin for cloning a string template into a new shadow root.

  **Kind**: global class
<a name="SimpleTemplate+reflectClass"></a>

### simpleTemplate.reflectClass(className, value)
Set/unset the class with the indicated name.

This method exists primarily to handle the case where an element wants to
set a default property value that should be reflected as as class. An
important limitation of custom element consturctors is that they cannot
set attributes, including the `class` attribute. A call to
`reflectClass` during the constructor will be deferred until the element
is connected to the document.

  **Kind**: instance method of <code>[SimpleTemplate](#SimpleTemplate)</code>

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The name of the class to set. |
| value | <code>object</code> | True to set the class, false to remove it. |

