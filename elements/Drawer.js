import AsyncTransitionMixin from '../mixins/AsyncTransitionMixin.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import DialogWrapper from './DialogWrapper.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OpenCloseTransitionMixin from '../mixins/OpenCloseTransitionMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import symbols from '../mixins/symbols.js';


const mixins = [
  AsyncTransitionMixin,
  AttributeMarshallingMixin,
  KeyboardMixin,
  OpenCloseMixin,
  OpenCloseTransitionMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


class DrawerPanelCore extends base {

  [symbols.shadowCreated]() {
    super[symbols.shadowCreated]();
    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  get [symbols.template]() {
    return `
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

        :host(.opened) #backdrop {
          opacity: 0.4;
        }

        #overlayContent {
          transform: translateX(-100%);
          transition: transform 0.25s ease-in;
          will-change: transform;
        }

        :host(.opened) #overlayContent {
          transform: translateX(0);
          transition-timing-function: ease-out;
        }
      </style>
      <slot></slot>
    `;
  }

}


class DrawerPanel extends DialogWrapper(DrawerPanelCore) {}


customElements.define('elix-drawer', DrawerPanel);
export default DrawerPanel;
