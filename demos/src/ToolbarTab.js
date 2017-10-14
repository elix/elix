import * as props from '../../mixins/props.js';
// import FocusRingMixin from '../../mixins/FocusRingMixin.js';
import TabButton from '../../elements/TabButton.js';


class ToolbarTab extends TabButton {

  buttonStyle() {
    const base = super.buttonStyle ? super.buttonStyle() : {};
    const selected = this.state.selected;
    return Object.assign(
      {},
      base,
      {
        'align-items': 'center',
        'background': 'transparent',
        'border': 'none',
        'color': selected ? 'dodgerblue' : base.color || null,
        'display': 'flex',
        'flex': '1',
        'flex-direction': 'column',
        'font-family': 'inherit',
        'font-size': 'inherit',
        'outline': 'none',
        'padding': '6px',
        '-webkit-tap-highlight-color': 'transparent'
      }
    );
  }
  
}


customElements.define('toolbar-tab', ToolbarTab);
export default ToolbarTab;
