# API Documentation
<a name="module_ShadowTemplateMixin"></a>

## ShadowTemplateMixin ⇒ <code>Class</code>
Mixin which adds stamping a template into a Shadow DOM subtree upon component
instantiation.

To use this mixin, define a `template` property as a string or HTML
`<template>` element:

    class MyElement extends ShadowTemplateMixin(HTMLElement) {
      get [symbols.template]() {
        return `Hello, <em>world</em>.`;
      }
    }

When your component class is instantiated, a shadow root will be created on
the instance, and the contents of the template will be cloned into the
shadow root. If your component does not define a `template` property, this
mixin has no effect.

For the time being, this extension retains support for Shadow DOM v0. That
will eventually be deprecated as browsers (and the Shadow DOM polyfill)
implement Shadow DOM v1.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

