//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AsyncEffectMixin from '../mixins/AsyncEffectMixin.js';
import TransitionEffectMixin from '../mixins/TransitionEffectMixin.js';
import Popup from './Popup.js';
import symbols from '../mixins/symbols.js';


const durationKey = Symbol('duration');
const timeoutKey = Symbol('timeout');


const Base = 
  AsyncEffectMixin(
  TransitionEffectMixin(
    Popup
  ));


class Toast extends Base {

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

    if (typeof this.duration === 'undefined') {
      this.duration = this[symbols.defaults].duration;
    }
  }

  [symbols.afterEffect](effect) {
    if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
    switch (effect) {
      case 'opening':
        startTimer(this);
        break;
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.duration = 1000; /* milliseconds */
    return defaults;
  }

  /**
   * @type {number}
   */
  get duration() {
    return this[durationKey];
  }
  /**
   * @param {number} duration
   */
  set duration(duration) {
    this[durationKey] = typeof duration === 'string' ? parseInt(duration) : duration;
  }

  [symbols.openedChanged](opened) {
    super[symbols.openedChanged](opened);
    if (!opened) {
      clearTimer(this);
    }
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
          align-items: center;
          flex-direction: column;
          justify-content: flex-end;
        }

        #backdrop {
          background: none;
        }

        #overlayContent {
          margin-bottom: 1em;
          opacity: 0;
          transform: translateY(100%);
          transition-duration: 0.25s;
          transition-property: opacity transform;
          transition-timing-function: ease-in;
          will-change: opactiy transform;
        }

        :host(.opening-effect) #overlayContent {
          opacity: 1.0;
          transform: translateY(0);
          transition-timing-function: ease-out;
        }

        @media (prefers-reduced-motion) {
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


customElements.define('elix-toast', Toast);
export default Toast;


function clearTimer(element) {
  if (element[timeoutKey]) {
    clearTimeout(element[timeoutKey]);
    element[timeoutKey] = null;
  }
}

function startTimer(element) {
  clearTimer(element);
  element[timeoutKey] = setTimeout(() => {
    element[symbols.raiseChangeEvents] = true;
    element.close();
    element[symbols.raiseChangeEvents] = false;
  }, element.duration);
}
