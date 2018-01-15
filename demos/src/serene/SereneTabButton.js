import { merge } from '../../../src/updates.js';
import HoverMixin from '../../../src/HoverMixin.js';
import TabButton from '../../../src/TabButton.js';


const Base =
  HoverMixin(
    TabButton
  );


class SereneTabButton extends Base {

  get updates() {
    const base = super.updates || {};
    const active = this.state.hover || this.state.focusVisible;
    const background = this.state.selected ?
      '#666' :
      this.state.hover ?
        '#444' :
        '#222';
    return merge(base, {
      style: {
        'margin-left': 0
      },
      $: {
        inner: {
          style: {
            background,
            'border': 'none',
            'border-radius': 0,
            'color': 'inherit',
            'display': 'inline-block',
            'font-size': '18px',
            'margin': 0,
            'outline': 'none',
            'padding': '0.5em 1em',
            'touch-action': 'manipulation',
            'transition': 'background 0.6s ease-out',
            '-webkit-tap-highlight-color': 'transparent',
            'white-space': 'nowrap'
          }
        }
      }
    });
  }

}


customElements.define('serene-tab-button', SereneTabButton);
export default SereneTabButton;
