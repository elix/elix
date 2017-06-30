//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import BackdropWrapper from './BackdropWrapper.js';
import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import FocusCaptureWrapper from './FocusCaptureWrapper.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import symbols from '../mixins/symbols.js';
import TransitionEffectMixin from '../mixins/TransitionEffectMixin.js';


const Base =
  // Relative order of wrapper application matters: first focus capture
  // wrapper, then backdrop wrapper. Remaining mixins can be applied in
  // any order.
  BackdropWrapper(
  FocusCaptureWrapper(

  AttributeMarshallingMixin(
  DialogModalityMixin(
  KeyboardMixin(
  OpenCloseMixin(
  OverlayMixin(
  ShadowTemplateMixin(
  TransitionEffectMixin(
    HTMLElement
  )))))))));


class Drawer extends Base {
  
  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }
    // We can't seem to write a CSS rule that lets a shadow element be sensitive
    // to the `dir` attribute of an ancestor, so we reflect the inherited
    // direction to the component. We can then write styles that key off of
    // that.
    const direction = getComputedStyle(this).direction;
    if (direction === 'rtl' && !this.dir) {
      this.setAttribute('dir', 'rtl');
    }
  }

  [symbols.elementsWithTransitions](effect) {
    return [
      this.backdrop,
      this.shadowRoot.querySelector('#overlayContent')
    ];
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }

    // Implicitly close on background clicks.
    this.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  [symbols.template](filler) {
    return super[symbols.template](`
      <style>
        :host {
          display: flex;
          align-items: stretch;
          flex-direction: row;
          justify-content: flex-start;
        }

        :host(:not(.visible)) {
          display: none;
        }

        #backdrop {
          background: black;
          opacity: 0;
          will-change: opacity;
        }

        :host(.effect) #backdrop {
          transition: opacity 0.25s linear;
        }
        :host(.opened:not(.effect)) #backdrop,
        :host(.effect.opening) #backdrop {
          opacity: 0.4;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          transform: translateX(-100%);
          will-change: transform;
        }
        :host([dir="rtl"]) #overlayContent {
          transform: translateX(100%);
        }

        :host(.opened:not(.effect)) #overlayContent,
        :host(.effect.opening) #overlayContent {
          transform: translateX(0);
        }

        :host(.effect) #overlayContent {
          transition: transform 0.25s;
        }
        :host(.effect.opening) #overlayContent {
          transition-timing-function: ease-out;
        }
        :host(.effect.closing) #overlayContent {
          transition-timing-function: ease-in;
        }
      </style>
      ${ filler || `<slot></slot>`}
    `);
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
