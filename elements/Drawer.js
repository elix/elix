import AsyncTransitionMixin from '../mixins/AsyncTransitionMixin.js';
import Dialog from './Dialog.js';
import OpenCloseTransitionMixin from '../mixins/OpenCloseTransitionMixin.js';
import symbols from '../mixins/symbols.js';


const mixins = [
  AsyncTransitionMixin,
  OpenCloseTransitionMixin,
];

// Apply the above mixins to Dialog.
const base = mixins.reduce((cls, mixin) => mixin(cls), Dialog);


class Drawer extends base {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated]() }
    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  get [symbols.template]() {
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
      </style>
      <slot></slot>
    `;
    return baseTemplate.replace(`<slot></slot>`, contentTemplate);
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
