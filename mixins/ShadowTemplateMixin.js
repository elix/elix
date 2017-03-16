import symbols from './symbols';


// A cache of processed templates.
//
// We maintain this as a map keyed by element tag (localName). We could store
// an element's processed template on its element prototype. One scenario that
// wouldn't support would be registration of the same constructor under multiple
// tag names, which was a (perhaps theoretical) use case for Custom Elements.
//
const mapTagToTemplate = {};


/**
 * Mixin which adds stamping a template into a Shadow DOM subtree upon component
 * instantiation.
 *
 * To use this mixin, define a `template` property as a string or HTML
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
 * shadow root. If your component does not define a `template` property, this
 * mixin has no effect.
 *
 * For the time being, this extension retains support for Shadow DOM v0. That
 * will eventually be deprecated as browsers (and the Shadow DOM polyfill)
 * implement Shadow DOM v1.
 *
 * @module ShadowTemplateMixin
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function ShadowTemplateMixin(base) {

  /**
   * The class prototype added by the mixin.
   */
  class ShadowTemplate extends base {

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    constructor() {
      super();

      const tag = this.localName;
      let template = mapTagToTemplate[tag];

      // See if we've already processed a template for this tag.
      if (!template) {
        // This is the first time we've created an instance of this tag.

        // Get the template and perform initial processing.
        template = this[symbols.template];
        if (!template) {
          console.warn(`ShadowTemplateMixin expects a component to define a property called [symbols.template].`);
          return;
        }

        if (typeof template === 'string') {
          // Upgrade plain string to real template.
          const templateText = template;
          template = document.createElement('template');
          template.innerHTML = templateText;
        }

        if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
          // Let the CSS polyfill do its own initialization.
          window.ShadyCSS.prepareTemplate(template, tag);
        }

        // Store this for the next time we create the same type of element.
        mapTagToTemplate[tag] = template;
      }

      // Stamp the template into a new shadow root.
      const root = this.attachShadow({ mode: 'open' });
      const clone = document.importNode(template.content, true);
      root.appendChild(clone);

      /* Let the component know the shadow tree has been populated. */
      if (this[symbols.shadowCreated]) {
        this[symbols.shadowCreated]();
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
        window.ShadyCSS.styleElement(this);
      }
    }

  }

  return ShadowTemplate;
}
