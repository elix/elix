import * as symbols from './symbols.js';


// A cache of processed templates, indexed by element class.
const classTemplateMap = new Map();

const shadowReferencesKey = Symbol('shadowReferences');

/**
 * Mixin which adds stamping a template into a Shadow DOM subtree upon component
 * instantiation.
 *
 * To use this mixin, define a `template` method that returns a string or HTML
 * `<template>` element:
 *
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       get [symbols.template]() {
 *         return `Hello, <em>world</em>.`;
 *       }
 *     }
 *
 * When your component class is instantiated, a shadow root will be created on
 * the instance, and the contents of the template will be cloned into the
 * shadow root. If your component does not define a `template` method, this
 * mixin has no effect.
 * 
 * This adds a member on the component called `this.$` that can be used to
 * reference shadow elements with IDs. E.g., if component's shadow contains an
 * element `<button id="foo">`, then this mixin will create a member
 * `this.$.foo` that points to that button.
 *
 * @module ShadowTemplateMixin
 */
export default function ShadowTemplateMixin(Base) {

  // The class prototype added by the mixin.
  class ShadowTemplate extends Base {

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
      if (this.shadowRoot) {
        // Already rendered
        return;
      }
      
      // See if we've already processed a template for this type of element.
      const template = getPreparedTemplate(this);

      // Stamp the template into a new shadow root.
      if (template) {
        const root = this.attachShadow({ mode: 'open' });
        const clone = document.importNode(template.content, true);
        root.appendChild(clone);
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // @ts-ignore
      if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
        // @ts-ignore
        window.ShadyCSS.styleElement(this);
      }
    }

    /**
     * The collection of references to the elements with IDs in the
     * component's Shadow DOM subtree.
     *
     * Example: if component's template contains a shadow element
     * `<button id="foo">`, you can use the reference `this.$.foo` to obtain
     * the corresponding button in the component instance's shadow tree.
     * 
     * Such references simplify a component's access to its own elements. In
     * exchange, this mixin trades off a one-time cost of querying all
     * elements in the shadow tree instead of paying an ongoing cost to query
     * for an element each time the component wants to inspect or manipulate
     * it.
     * 
     * These shadow element references are established the first time you read
     * the `$` property. They are _not_ updated if you subsequently modify the
     * shadow tree yourself (to replace one item with another, to add new items
     * with `id` attributes, etc.).
     *
     * @type {object} - a dictionary mapping shadow element IDs to elements
     */
    get $() {
      if (!this[shadowReferencesKey] && this.shadowRoot) {
        this[shadowReferencesKey] = shadowElementReferences(this);
      }
      return this[shadowReferencesKey];
    }

  }

  return ShadowTemplate;
}


function getPreparedTemplate(element) {
  const hasDynamicTemplate = element[symbols.hasDynamicTemplate];
  let template = !hasDynamicTemplate && classTemplateMap.get(element.constructor);
  if (!template) {
    // This is the first time we've created an instance of this type.
    template = prepareTemplate(element);
    if (!hasDynamicTemplate && template) {
      // Store prepared template for next creation of same type of element.
      classTemplateMap.set(element.constructor, template);
    }
  }
  return template;
}


// Retrieve an element's template and prepare it for use.
function prepareTemplate(element) {

  let template = element[symbols.template];

  if (!template) {
    /* eslint-disable no-console */
    console.warn(`ShadowTemplateMixin expects ${element.constructor.name} to define a property called [symbols.template].\nSee https://elix.org/documentation/ShadowTemplateMixin.`);
    return;
  }

  if (typeof template === 'string') {
    // Upgrade plain string to real template.
    const templateText = template;
    template = document.createElement('template');
    template.innerHTML = templateText;
    
    // A polyfill bug under IE
    // (probably https://github.com/webcomponents/webcomponentsjs/issues/474)
    // prevents the template's innerHTML from being set properly if it
    // contains other elements. We check to make sure the assignment stuck.
    if (template.innerHTML !== templateText) {
      template.innerHTML = templateText;
    }
  }

  // @ts-ignore
  if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
    // Let the CSS polyfill do its own initialization.
    const tag = element.localName;
    // @ts-ignore
    window.ShadyCSS.prepareTemplate(template, tag);
  }

  return template;
}


// Look for elements in the shadow subtree that have id attributes.
function shadowElementReferences(component) {
  const result = {};
  const nodesWithIds = component.shadowRoot.querySelectorAll('[id]');
  Array.prototype.forEach.call(nodesWithIds, node => {
    const id = node.getAttribute('id');
    result[id] = node;
  });
  return result;
}
