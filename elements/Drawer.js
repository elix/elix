//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AsyncEffectMixin from '../mixins/AsyncEffectMixin.js';
import Dialog from './Dialog.js';
import OpenCloseEffectMixin from '../mixins/OpenCloseEffectMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AsyncEffectMixin(
  OpenCloseEffectMixin(
    Dialog
  ));


class Drawer extends Base {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }

    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  get [symbols.template]() {
    // Inject our template into the base template.
    let baseTemplate = super[symbols.template];
    if (baseTemplate instanceof HTMLTemplateElement) {
      baseTemplate = baseTemplate.innerHTML; // Downgrade to string.
    }
    const contentTemplate = `
      <style>
        :host {
          align-items: stretch;
          flex-direction: row;
          justify-content: flex-start;
        }

        #backdrop {
          opacity: 0;
          transition: opacity 0.25s linear;
        }

        :host(.opened) #backdrop {
          opacity: 0.4;
        }

        #overlayContent {
          transform: translateX(-100%);
          transition: transform 0.25s ease-in;
          will-change: transform;
        }

        :host(.opened) #overlayContent {
          transform: translateX(0);
          transition-timing-function: ease-out;
        }

        @media (prefers-reduced-motion) {
          #backdrop,
          #overlayContent {
            transition-duration: 0.001s;
          }
        }
        </style>
      <slot></slot>
    `;
    return baseTemplate.replace(`<slot></slot>`, contentTemplate);
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
