import OpenCloseTransitionMixin from '../mixins/OpenCloseTransitionMixin.js';
import Popup from './Popup.js';
import symbols from '../mixins/symbols.js';


const timeout = Symbol('timeout');
const transitionendListener = Symbol('transitionendListener');


class TransientMessage extends OpenCloseTransitionMixin(Popup) {

  [symbols.afterTransition](transition) {
    if (super[symbols.afterTransition]) { super[symbols.afterTransition](transition); }
    switch (transition) {
      case 'opening':
        if (this[timeout]) {
          clearTimeout(this[timeout]);
        }
        this[timeout] = setTimeout(() => {
          this.close();
        }, 1000);
        break;
    }
  }

  get opened() {
    return super.opened;
  }
  set opened(opened) {
    const changed = opened !== this.opened;
    super.opened = opened;
    if (changed && !opened && this[timeout]) {
      clearTimeout(this[timeout]);
      this[timeout] = null;
    }
  }

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
          align-items: center;
          flex-direction: column;
          justify-content: flex-end;
        }

        #backdrop {
          background: none;
        }

        #overlayContent {
          margin-bottom: 1em;
          transform: translateY(100%);
          transition: transform 0.25s ease-in;
          will-change: transform;
        }

        :host(.opened) #overlayContent {
          transform: translateY(0);
          transition-timing-function: ease-out;
        }
      </style>
      <slot></slot>
    `;
    return baseTemplate.replace(`<slot></slot>`, injectTemplate);
  }

}


customElements.define('elix-transient-message', TransientMessage);
export default TransientMessage;
