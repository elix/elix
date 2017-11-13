import { merge } from '../../../utilities/updates.js';
import Modes from '../../../elements/Modes.js';


class SereneModes extends Modes {

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates(item, calcs, original);
    return merge(base, {
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

  get updates() {
    return merge(super.updates, {
      style: {
        display: 'block'
      }
    });
  }

}


customElements.define('serene-modes', SereneModes);
export default SereneModes;
