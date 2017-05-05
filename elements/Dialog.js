import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayWrapper from './OverlayWrapper.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const wrappingFocus = Symbol('wrappingFocus');
const previousBodyStyleOverflow = Symbol('previousBodyStyleOverflow');


const mixins = [
  AttributeMarshallingMixin,
  KeyboardMixin,
  OpenCloseMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


class DialogCore extends base {

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }

    // Set default ARIA role for the dialog.
    if (this.getAttribute('role') == null && this[symbols.defaults].role) {
      this.setAttribute('role', this[symbols.defaults].role);
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.role = 'dialog';
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
        // Mark body as non-scrollable, to absorb space bar keypresses and other
        // means of scrolling the top-level document.
        // TODO: Walk up the dialog's parent hierarchy and do the same for any
        // scrollable parents in it.
        this[previousBodyStyleOverflow] = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this[previousBodyStyleOverflow];
        this[previousBodyStyleOverflow] = null;
      }
    }
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }

    // Disable scrolling of the background while dialog is open.
    this.$.backdrop.addEventListener('mousewheel', event => disableEvent(event));
    this.$.backdrop.addEventListener('touchmove', event => {
      // Don't disable multi-touch gestures like pinch-zoom.
      if (event.touches.length === 1) {
        disableEvent(event);
      }
    });

    this.$.focusCatcher.addEventListener('focus', event => {
      if (!this[wrappingFocus]) {
        // Wrap focus back to the dialog.
        this.focus();
      }
    });
    this.addEventListener('keydown', event => {
      if (document.activeElement === this &&
          this.shadowRoot.activeElement === null &&
          event.keyCode === 9 && event.shiftKey) {
        // Set focus to focus catcher.
        // The Shift+Tab keydown event should continue bubbling, and the default
        // behavior should cause it to end up on the last focusable element.
        this[wrappingFocus] = true;
        this.$.focusCatcher.focus();
        this[wrappingFocus] = false;
      }
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        #backdrop {
          background: black;
          opacity: 0.2;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
      </style>
      <slot></slot>
      <div id="focusCatcher" tabindex="0"></div>
    `;
  }

}


class Dialog extends OverlayWrapper(DialogCore) {}


customElements.define('elix-dialog', Dialog);
export default Dialog;


function disableEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
