import * as props from '../../../mixins/props.js';
import HoverMixin from '../../../mixins/HoverMixin.js';
import TabButton from '../../../elements/TabButton.js';


const Base =
  HoverMixin(
    TabButton
  );


class SereneTabButton extends Base {

  get props() {
    const base = super.props || {};
    const active = this.state.hover || this.state.focusRing;
    const background = this.state.selected ?
      '#666' :
      this.state.hover ?
        '#444' :
        '#222';
    return props.merge(base, {
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
