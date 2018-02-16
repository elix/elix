import { merge } from '../../src/updates.js';
import ArrowDirectionButton from '../../src/ArrowDirectionButton.js';


class StripArrowDirectionButton extends ArrowDirectionButton {

  get updates() {
    const base = super.updates;
    const color = base.style && base.style.color || 'inherit';
    const style = Object.assign({}, base.style, {
      color
    });
    return merge(super.updates, {
      style
    });
  }

}


customElements.define('strip-arrow-direction-button', StripArrowDirectionButton);
export default StripArrowDirectionButton;
