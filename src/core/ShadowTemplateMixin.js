import {
  delegatesFocus,
  hasDynamicTemplate,
  ids,
  render,
  shadowRoot,
  shadowRootMode,
  template,
} from "./internal.js";

// A cache of processed templates, indexed by element class.
const classTemplateMap = new Map();

// A Proxy that maps shadow element IDs to shadow elements.
// This will be return as the element's `this[ids]` property;
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
    const root = element[shadowRoot];

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
 *     import { createElement, replace, transmute } from 'elix/src/template.js';
 *
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       get [template]() {
 *         return templateFrom.html`Hello, <em>world</em>.`;
 *       }
 *     }
 *
 * When your component class is instantiated, a shadow root will be created on
 * the instance, and the contents of the template will be cloned into the
 * shadow root. If your component does not define a `template` method, this
 * mixin has no effect.
 *
 * This adds a member on the component called `this[ids]` that can be used to
 * reference shadow elements with IDs. E.g., if component's shadow contains an
 * element `<button id="foo">`, then this mixin will create a member
 * `this[ids].foo` that points to that button.
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
     * id="foo">`, you can use the reference `this[ids].foo` to obtain
     * the corresponding button in the component instance's shadow tree. The
     * `ids` property is simply a shorthand for `getElementById`, so
     * `this[ids].foo` is the same as
     * `this[shadowRoot].getElementById('foo')`.
     *
     * @type {object} - a dictionary mapping shadow element IDs to elements
     */
    get [ids]() {
      if (!this[shadowIdProxyKey]) {
        // Construct a proxy that maps to getElementById.
        const target = {
          // Give the proxy a means of refering to this element via the target.
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
    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }

      // We populate the shadow root if the component doesn't have a shadow;
      // i.e., the first time the component is rendered. For this check, we use
      // an internal reference we maintain for the shadow root; see below.
      if (this[shadowRoot] === undefined) {
        // If this type of element defines a template, prepare it for use.
        const template = getTemplate(this);

        if (template) {
          // Stamp the template into a new shadow root.
          const root = this.attachShadow({
            delegatesFocus: this[delegatesFocus],
            mode: this[shadowRootMode],
          });
          const clone = document.importNode(template.content, true);
          root.append(clone);

          // After this call, we won't be able to rely on being able to access
          // the shadow root via `this.shadowRoot`, because the component may
          // have asked for a closed shadow root. We save a reference to the
          // shadow root now so that the component always has a consistent means
          // to reference its own shadow root.
          this[shadowRoot] = root;
        } else {
          // No template. Set shadow root to null (instead of undefined) so we
          // won't try to render shadow on next render.
          // @ts-ignore Not sure why/how TS has type info on this[shadowRoot].
          this[shadowRoot] = null;
        }
      }
    }

    /**
     * @type {ShadowRootMode}
     * @default "open"
     */
    get [shadowRootMode]() {
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
  let t = element[hasDynamicTemplate]
    ? undefined // Always retrieve template
    : classTemplateMap.get(element.constructor); // See if we've cached it
  if (t === undefined) {
    // Ask the component for its template.
    t = element[template];
    // A component using this mixin isn't required to supply a template --
    // if they don't, they simply won't end up with a shadow root.
    if (t) {
      // But if the component does supply a template, it needs to be an
      // HTMLTemplateElement instance.
      if (!(t instanceof HTMLTemplateElement)) {
        throw `Warning: the [template] property for ${element.constructor.name} must return an HTMLTemplateElement.`;
      }
    }
    if (!element[hasDynamicTemplate]) {
      // Store prepared template for next creation of same type of element.
      // If the component didn't define a template, store null so that we skip
      // the template retrieval next time.
      classTemplateMap.set(element.constructor, t || null);
    }
  }
  return t;
}
