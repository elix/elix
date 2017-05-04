import Dialog from './Dialog.js';
import OpenCloseTransitionMixin from '../mixins/OpenCloseTransitionMixin.js';
import symbols from '../mixins/symbols.js';


class DrawerPanel extends OpenCloseTransitionMixin(Dialog) {

  [symbols.shadowCreated]() {
    super[symbols.shadowCreated]();
    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  get [symbols.template]() {
    const baseTemplate = super[symbols.template];
    const injectTemplate = `
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

        #popupContent {
          transform: translateX(-100%);
          transition: transform 0.25s ease-in;
          will-change: transform;
        }

        :host(.opened) #popupContent {
          transform: translateX(0);
          transition-timing-function: ease-out;
        }
      </style>
      <slot></slot>
    `;
    return baseTemplate.replace(`<slot></slot>`, injectTemplate);
  }

}


customElements.define('elix-drawer', DrawerPanel);
export default DrawerPanel;
