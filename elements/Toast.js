//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AsyncEffectMixin from '../mixins/AsyncEffectMixin.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import symbols from '../mixins/symbols.js';
import TransitionEffectMixin from '../mixins/TransitionEffectMixin.js';


const durationKey = Symbol('duration');
const timeoutKey = Symbol('timeout');


const Base =
  AsyncEffectMixin(
  AttributeMarshallingMixin(
  OpenCloseMixin(
  OverlayMixin(
  ShadowReferencesMixin(
  ShadowTemplateMixin(
  TransitionEffectMixin(
    HTMLElement
  )))))));


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
        if (this.duration != null) {
          startTimer(this);
        }
        break;
    }
  }

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }

    // Set default ARIA role for the dialog.
    if (this.getAttribute('role') == null && this[symbols.defaults].role) {
      this.setAttribute('role', this[symbols.defaults].role);
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.duration = 2500; /* milliseconds */
    defaults.role = 'alert';
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

  [symbols.effectElements](effect) {
    return [this.$.overlayContent];
  }

  [symbols.openedChanged](opened) {
    super[symbols.openedChanged](opened);
    if (!opened) {
      clearTimer(this);
    }
  }

  [symbols.template](filler) {
    return `
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: flex-end;
          left: 0;
          outline: none;
          pointer-events: none;
          position: fixed;
          top: 0;
          width: 100%;
        }

        :host(:not(.visible)) {
          display: none;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          margin-bottom: 1em;
          opacity: 0;
          pointer-events: initial;
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
      <div id="overlayContent">
        ${filler || `<slot></slot>`}
      </div>
    `;
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
