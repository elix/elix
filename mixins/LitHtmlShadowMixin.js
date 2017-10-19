import { render, NodePart } from '../node_modules/lit-html/lit-html.js';
import symbols from './symbols.js';


// HACK: Workaround waiting for https://github.com/PolymerLabs/lit-html/pull/129
var old = NodePart.prototype._setNode;
NodePart.prototype._setNode = function (value) {
  if (this._previousValue !== value) {
    return old.call(this, value);
  }
}


/**
 * Mixin for rendering a component's Shadow DOM using lit-html.
 */
export default function LitHtmlShadowMixin(Base) {
  return class LitHtmlShadow extends Base {

    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }

      let newShadow = false;
      if (!this.shadowRoot) {
        // Initial render; create shadow.
        this.attachShadow({ mode: 'open' });
        newShadow = true;
      }

      const template = this[symbols.template];
      if (!template) {
        /* eslint-disable no-console */
        console.warn(`LitHtmlShadowMixin expects ${this.constructor.name} to define a method called [symbols.template].`);
        return;
      }
      
      if (newShadow && window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
        // Let the CSS polyfill do its own initialization.
        const tag = this.localName;
        // Get the actual HTMLTemplateElement.
        const templateElement = template.template.element;
        window.ShadyCSS.prepareTemplate(templateElement, tag);
      }

      // Invoke lit-html to render the shadow subtree.
      render(template, this.shadowRoot);

      // If we've created a new shadow, let the component do other
      // initialization based on the rendered shadow tree.
      if (newShadow && this[symbols.shadowCreated]) {
        this[symbols.shadowCreated]();
      }
    }

  }
}
