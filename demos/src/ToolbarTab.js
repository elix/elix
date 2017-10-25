import * as props from '../../mixins/props.js';
import TabButton from '../../elements/TabButton.js';


class ToolbarTab extends TabButton {

  get buttonProps() {
    const base = super.buttonProps;
    const baseColor = base.style && base.style.color;
    return props.merge(base, {
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
    });
  }
  
}


customElements.define('toolbar-tab', ToolbarTab);
export default ToolbarTab;
