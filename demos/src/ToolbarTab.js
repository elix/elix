import { merge } from '../../src/updates.js';
import TabButton from '../../src/TabButton.js';


class ToolbarTab extends TabButton {

get defaultState() {
  return Object.assign({}, super.defaultState, {
    overlapPanel: false
  });
}

  get updates() {
    const base = super.updates || {};
    const baseColor = base.style && base.style.color;
    return merge(base, {
      $: {
        inner: {
          style: {
            'align-items': 'center',
            'background': 'transparent',
            'border': 'none',
            'color': this.state.selected ? 'dodgerblue' : baseColor,
            'display': 'flex',
            'flex': '1',
            'flex-direction': 'column',
            'font-family': 'inherit',
            'font-size': 'inherit',
            'padding': '6px',
            '-webkit-tap-highlight-color': 'transparent'
          }
        }
      }
    });
  }
  
}


customElements.define('toolbar-tab', ToolbarTab);
export default ToolbarTab;
