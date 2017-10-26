import * as props from '../mixins/props.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import PopupModalityMixin from '../mixins/PopupModalityMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  KeyboardMixin(
  OverlayMixin(
  PopupModalityMixin(
    ElementBase
  )));


/**
 * A `Popup` is a lightweight form of overlay that, when opened, displays its
 * children on top of other page elements.
 * 
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes PopupModalityMixin
 * @mixes ShadowTemplateMixin
 */
class Popup extends Base {

  get props() {
    const base = super.props || {};

    const display = this.closed ?
      null :
      base.style && base.style.display || 'flex';

    return props.merge(base, {
      
      style: {
        'alignItems': 'center',
        display,
        'flex-direction': 'column',
        'height': '100%',
        'justify-content': 'center',
        'left': 0,
        'outline': 'none',
        'pointer-events': 'none',
        'position': 'fixed',
        'top': 0,
        '-webkit-tap-highlight-color': 'transparent',
        'width': '100%'
      },

      $: {
        content: {
          style: {
            'background': 'white',
            'border': '1px solid rgba(0, 0, 0, 0.2)',
            'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.5)',
            'pointer-events': 'initial',
            'position': 'relative'
          }
        }
      }

    });
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    props.apply(this.$.content, this.contentProps);
  }

  get [symbols.template]() {
    return `
      <div id="content">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('elix-popup', Popup);
export default Popup;
