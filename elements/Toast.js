import AsyncTransitionMixin from '../mixins/AsyncTransitionMixin.js';
import OpenCloseTransitionMixin from '../mixins/OpenCloseTransitionMixin.js';
import Popup from './Popup.js';
import symbols from '../mixins/symbols.js';


const timeoutKey = Symbol('timeout');


const mixins = [
  AsyncTransitionMixin,
  OpenCloseTransitionMixin,
];

// Apply the above mixins to Popup.
const base = mixins.reduce((cls, mixin) => mixin(cls), Popup);


class Toast extends base {

  [symbols.afterTransition](transition) {
    if (super[symbols.afterTransition]) { super[symbols.afterTransition](transition); }
    switch (transition) {
      case 'opening':
        if (this[timeoutKey]) {
          clearTimeout(this[timeoutKey]);
        }
        this[timeoutKey] = setTimeout(() => {
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
    if (changed && !opened && this[timeoutKey]) {
      clearTimeout(this[timeoutKey]);
      this[timeoutKey] = null;
    }
  }

  get [symbols.template]() {
    const baseTemplate = super[symbols.template];
    const contentTemplate = `
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
    return baseTemplate.replace(`<slot></slot>`, contentTemplate);
  }

}


customElements.define('elix-toast', Toast);
export default Toast;
