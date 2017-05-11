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

  constructor() {
    super();

    // If the user moves the mouse over the element, stop the timer.
    this.addEventListener('mouseover', () => {
      clearTimer(this);
    });

    // If the user moves the mouse away, restart the timer.
    this.addEventListener('mouseout', () => {
      startTimer(this);
    });
  }

  [symbols.afterTransition](transition) {
    if (super[symbols.afterTransition]) { super[symbols.afterTransition](transition); }
    switch (transition) {
      case 'opening':
        startTimer(this);
        break;
    }
  }

  get opened() {
    return super.opened;
  }
  set opened(opened) {
    const changed = opened !== this.opened;
    super.opened = opened;
    if (changed && !opened) {
      clearTimer(this);
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


function clearTimer(element) {
  if (element[timeoutKey]) {
    console.log('clearTimer');
    clearTimeout(element[timeoutKey]);
    element[timeoutKey] = null;
  }
}

function startTimer(element) {
  console.log('startTimer');
  clearTimer(element);
  element[timeoutKey] = setTimeout(() => {
    element.close();
  }, 1000);
}
