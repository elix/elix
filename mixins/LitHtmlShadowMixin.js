import { render } from '../node_modules/lit-html/lit-html.js';
import symbols from './symbols.js';


/**
 * Mixin for rendering a component's Shadow DOM using lit-html.
 */
export default function LitHtmlShadowMixin(Base) {
  return class LitHtmlShadow extends Base {

    [symbols.render]() {
      const base = super[symbols.render] ? super[symbols.render]() : Promise.resolve();
      return base.then(() => {

        // console.log(`rendering`);

        let newShadow = false;
        if (!this.shadowRoot) {
          // Initial render; create shadow.
          this.attachShadow({ mode: 'open' });
          newShadow = true;
        }

        const template = this[symbols.template];
        if (!template) {
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
      });
    }

  }
}
