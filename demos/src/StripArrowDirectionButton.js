import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import ArrowDirectionButton from '../../src/ArrowDirectionButton.js';


class StripArrowDirectionButton extends ArrowDirectionButton {

  get updates() {
    const base = super.updates;
    const style = Object.assign({}, base.style, {
      color: 'inherit'
    });
    return merge(super.updates, {
      style
    });
  }

}


customElements.define('strip-arrow-direction-button', StripArrowDirectionButton);
export default StripArrowDirectionButton;
