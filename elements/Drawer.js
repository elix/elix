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
  
  [symbols.effectElements](effect) {
    return [this.$.overlayContent];
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
          transition: opacity 0.25s linear;
        }

        :host(.opening-effect) #backdrop {
          opacity: 0.4;
        }

        #overlayContent {
          transform: translateX(-100%);
          transition: transform 0.25s ease-in;
          will-change: transform;
        }

        :host(.opening-effect) #overlayContent {
          transform: translateX(0);
          transition-timing-function: ease-out;
        }

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
