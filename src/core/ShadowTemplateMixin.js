import * as internal from "./internal.js";

// A cache of processed templates, indexed by element class.
const classTemplateMap = new Map();

// A Proxy that maps shadow element IDs to shadow elements.
// This will be return as the element's `this[internal.ids]` property;
// see comments in that property below.
/** @type {any} */
const shadowIdProxyKey = Symbol("shadowIdProxy");

// A reference stored on the shadow element proxy target to get to the actual
// element. We use a Symbol here instead of a string name to avoid naming
// conflicts with the element's internal shadow element IDs.
const proxyElementKey = Symbol("proxyElement");

// A handler used for the shadow element ID proxy.
const shadowIdProxyHandler = {
  get(target, id) {
    // From this proxy, obtain a reference to the original component.
    const element = target[proxyElementKey];

    // Get a reference to the component's open or closed shadow root.
    const root = element[internal.shadowRoot];

    // Look for a shadow element with the indicated ID.
    return root && typeof id === "string" ? root.getElementById(id) : null;
  },
};

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
 * @param {Constructor<HTMLElement>} Base
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
     * `this[internal.shadowRoot].getElementById('foo')`.
     *
     * @type {object} - a dictionary mapping shadow element IDs to elements
     */
    get [internal.ids]() {
      if (!this[shadowIdProxyKey]) {
        // Construct a proxy that maps to getElementById.
        const target = {
          // Give the proxy a means of refering this element via the target.
          [proxyElementKey]: this,
        };
        this[shadowIdProxyKey] = new Proxy(target, shadowIdProxyHandler);
      }
      return this[shadowIdProxyKey];
    }

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }

      // We only need to render the shadow root the first time the component is
      // rendered.
      const firstRender =
        this[internal.firstRender] === undefined || this[internal.firstRender];
      if (firstRender) {
        // If this type of element defines a template, prepare it for use.
        const template = getTemplate(this);

        if (template) {
          // Stamp the template into a new shadow root.
          const delegatesFocus = this[internal.delegatesFocus];
          const mode = this[internal.shadowRootMode];
          const root = this.attachShadow({ delegatesFocus, mode });
          const clone = document.importNode(template.content, true);
          root.append(clone);

          // After this call, we won' be able to rely on being able to access
          // the shadow root via `this.shadowRoot`, because the component may
          // have asked for a closed shadow root. We save a reference to the
          // shadow root now so that the component always has a consistent means
          // to reference its own shadow root.
          this[internal.shadowRoot] = root;
        }
      }
    }

    /**
     * @type {ShadowRootMode}
     * @default "open"
     */
    get [internal.shadowRootMode]() {
      return "open";
    }
  }

  return ShadowTemplate;
}

/**
 * Return the template for the element being instantiated.
 *
 * If this is the first time we're creating this type of element, or the
 * component has indicated that its template is dynamic (and should be retrieved
 * each time), ask the component class for the template and cache the result.
 * Otherwise, immediately return the cached template.
 *
 * @private
 * @param {HTMLElement} element
 * @returns {HTMLTemplateElement}
 */
function getTemplate(element) {
  const hasDynamicTemplate = element[internal.hasDynamicTemplate];
  let template = hasDynamicTemplate
    ? undefined // Always retrieve template
    : classTemplateMap.get(element.constructor); // See if we've cached it
  if (template === undefined) {
    // Ask the component for its template.
    template = element[internal.template];
    // A component using this mixin isn't required to supply a template --
    // if they don't, they simply won't end up with a shadow root.
    if (template) {
      // But if the component does supply a template, it needs to be an
      // HTMLTemplateElement instance.
      if (!(template instanceof HTMLTemplateElement)) {
        throw `Warning: the [internal.template] property for ${element.constructor.name} must return an HTMLTemplateElement.`;
      }
      if (!hasDynamicTemplate) {
        // Store prepared template for next creation of same type of element.
        classTemplateMap.set(element.constructor, template);
      }
    }
  }
  return template;
}
