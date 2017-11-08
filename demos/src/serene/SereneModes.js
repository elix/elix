import * as props from '../../../mixins/props.js';
import Modes from '../../../elements/Modes.js';


class SereneModes extends Modes {

  itemProps(item, calcs, original) {
    const base = super.itemProps(item, calcs, original);
    return props.merge(base, {
      style: {
        'background': 'white',
        'display': '', /* override base */
        opacity : calcs.selected ? 1 : 0,
        'padding': '0 33px',
        'position': 'absolute',
        'transition': 'opacity 0.75s'
      }
    });
  }

  get props() {
    return props.merge(super.props, {
      style: {
        display: 'block'
      }
    });
  }

}


customElements.define('serene-modes', SereneModes);
export default SereneModes;
