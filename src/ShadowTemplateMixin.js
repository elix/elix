import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

// A cache of processed templates, indexed by element class.
const classTemplateMap = new Map();

/** @type {any} */
const shadowReferencesKey = Symbol('shadowReferences');

/**
 * Stamps a template into a component's Shadow DOM when instantiated
 *
 * To use this mixin, define a `template` method that returns a string or HTML
 * `<template>` element:
 *
 *     import * as template from 'elix/src/template.js';
 *
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       get [internal.template]() {
 *         return template.html`Hello, <em>world</em>.`;
 *       }
 *     }
 *
 * When your component class is instantiated, a shadow root will be created on
 * the instance, and the contents of the template will be cloned into the
 * shadow root. If your component does not define a `template` method, this
 * mixin has no effect.
 *
 * This adds a member on the component called `this[internal.ids]` that can be used to
 * reference shadow elements with IDs. E.g., if component's shadow contains an
 * element `<button id="foo">`, then this mixin will create a member
 * `this[internal.ids].foo` that points to that button.
 *
 * @module ShadowTemplateMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ShadowTemplateMixin(Base) {
  // The class prototype added by the mixin.
  class ShadowTemplate extends Base {
    /**
     * A convenient shortcut for looking up an element by ID in the component's
     * Shadow DOM subtree.
     *
     * Example: if component's template contains a shadow element `<button
     * id="foo">`, you can use the reference `this[internal.ids].foo` to obtain
     * the corresponding button in the component instance's shadow tree. The
     * `ids` property is simply a shorthand for `getElementById`, so
     * `this[internal.ids].foo` is the same as
     * `this.shadowRoot.getElementById('foo')`.
     *
     * @type {object} - a dictionary mapping shadow element IDs to elements
     */
    get [internal.ids]() {
      if (!this[shadowReferencesKey]) {
        // Construct a proxy that maps $ -> getElementById.
        const element = this;
        this[shadowReferencesKey] = new Proxy(
          {},
          {
            /* eslint-disable no-unused-vars */
            get(target, property, receiver) {
              return element.shadowRoot && typeof property === 'string'
                ? element.shadowRoot.getElementById(property)
                : null;
            }
          }
        );
      }
      return this[shadowReferencesKey];
    }

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (this.shadowRoot) {
        // Already rendered
        return;
      }

      // If this type of element defines a template, prepare it for use.
      const template = getTemplate(this);
      if (template) {
        // Stamp the template into a new shadow root.
        const delegatesFocus = this[internal.delegatesFocus];
        const root = this.attachShadow({
          delegatesFocus,
          mode: 'open'
        });
        const clone = document.importNode(template.content, true);
        root.appendChild(clone);
      }
    }
  }

  return ShadowTemplate;
}

/**
 * Return and cache the template for the given element.
 *
 * @private
 * @param {HTMLElement} element
 */
function getTemplate(element) {
  const hasDynamicTemplate = element[internal.hasDynamicTemplate];
  let template = hasDynamicTemplate
    ? undefined // Always retrieve template
    : classTemplateMap.get(element.constructor); // See if we've cached it
  if (template === undefined) {
    // Ask the component for its template.
    template = element[internal.template] || null;
    if (template && !(template instanceof HTMLTemplateElement)) {
      throw `Warning: the [internal.template] property for ${element.constructor.name} must return an HTMLTemplateElement.`;
    }
    if (!hasDynamicTemplate) {
      // Store prepared template for next creation of same type of element.
      classTemplateMap.set(element.constructor, template);
    }
  }
  return template;
}
