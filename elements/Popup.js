import AsyncTransitionMixin from '../mixins/AsyncTransitionMixin.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayWrapper from './OverlayWrapper.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const closeListenerSymbol = Symbol('closeListener');
const resolvePromiseSymbol = Symbol('resolvePromise');
const wrappingFocusSymbol = Symbol('wrappingFocus');


const mixins = [
  AsyncTransitionMixin,
  AttributeMarshallingMixin,
  KeyboardMixin,
  OpenCloseMixin,
  OverlayWrapper,
  ShadowReferencesMixin,
  ShadowTemplateMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


class Popup extends base {

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }

    // Set default ARIA role for the dialog.
    if (this.getAttribute('role') == null && this[symbols.defaults].role) {
      this.setAttribute('role', this[symbols.defaults].role);
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.role = 'tooltip';
    return defaults;
  }

  get opened() {
    return super.opened;
  }
  set opened(opened) {
    const changed = opened !== this.opened;
    if ('opened' in base.prototype) { super.opened = opened; }
    if (changed) {
      if (opened) {
        this[closeListenerSymbol] = () => this.close();
        window.addEventListener('scroll', this[closeListenerSymbol]);
        window.addEventListener('blur', this[closeListenerSymbol]);
        window.addEventListener('resize', this[closeListenerSymbol]);
      } else {
        window.removeEventListener('scroll', this[closeListenerSymbol]);
        window.removeEventListener('blur', this[closeListenerSymbol]);
        window.removeEventListener('resize', this[closeListenerSymbol]);
      }
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
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
      </style>
      <slot></slot>
    `;
    return baseTemplate.replace(`<slot></slot>`, injectTemplate);
  }

}


customElements.define('elix-popup', Popup);
export default Popup;
