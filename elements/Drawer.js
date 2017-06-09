//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AsyncEffectMixin from '../mixins/AsyncEffectMixin.js';
import Dialog from './Dialog.js';
import TransitionEffectMixin from '../mixins/TransitionEffectMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AsyncEffectMixin(
  TransitionEffectMixin(
    Dialog
  ));


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

  [symbols.elementsWithEffectTransitions](effect) {
    return [
      this.$.backdrop,
      this.$.overlayContent
    ];
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }

    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  [symbols.template](filler) {
    return super[symbols.template](`
      <style>
        :host {
          align-items: stretch;
          flex-direction: row;
          justify-content: flex-start;
        }

        #backdrop {
          opacity: 0;
          will-change: opacity;
        }

        :host(.opened:not(.effect)) #backdrop {
          opacity: 0.4;
        }
        :host(.effect) #backdrop {
          opacity: 0.4;
          transition: opacity 0.25s linear;
        }

        #overlayContent {
          transform: translateX(-100%);
          will-change: transform;
        }
        :host([dir="rtl"]) #overlayContent {
          transform: translateX(100%);
        }

        :host(.opened:not(.effect)) #overlayContent {
          transform: translateX(0);
        }

        :host(.effect) #overlayContent {
          transition: transform 0.25s;
        }
        :host(.effect.opening) #overlayContent {
          transform: translateX(0);
          transition-timing-function: ease-out;
        }
        :host(.effect.closing) #overlayContent {
          transition-timing-function: ease-in;
        }

        /* TODO: Use matchMedia('(prefers-reduced-motion)').matches instead. */
        @media (prefers-reduced-motion) {
          #backdrop,
          #overlayContent {
            transition-duration: 0.001s;
          }
        }
      </style>
      ${ filler || `<slot></slot>`}
    `);
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
