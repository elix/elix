import { merge } from './updates.js';
import HoverMixin from './HoverMixin.js';
import SeamlessButton from './SeamlessButton.js';
import DarkModeMixin from './DarkModeMixin.js';


const Base = 
  DarkModeMixin(
  HoverMixin(
    SeamlessButton
  ));


/**
 * Button that can be used as a left or right arrow button.
 * 
 * This component is used by [ArrowDirectionMixin](ArrowDirectionMixin) for its
 * default left/right arrow buttons.
 * 
 * @inherits SeamlessButton
 * @mixes HoverMixin
 */
class ArrowDirectionButton extends Base {

  get updates() {
    /** @type {any} */
    const cast = this;
    let style;
    const darkMode = this.state.darkMode;
    if (darkMode === null) {
      // Initial render; wait for knowledge of dark mode.
      style = {};
    } else {
      // Use white color value in dark mode, or black value in light mode.
      const value = darkMode ? 255 : 0;
      style = Object.assign(
        {
          background: '',
          color: `rgba(${value}, ${value}, ${value}, 0.7)`,
          fill: 'currentColor',
          outline: 'none'
        },
        this.state.hover && !cast.disabled && {
          background: `rgba(${value}, ${value}, ${value}, 0.2)`,
          color: `rgba(${value}, ${value}, ${value}, 0.8)`,
          cursor: 'pointer'
        },
        cast.disabled && {
          color: `rgba(${value}, ${value}, ${value}, 0.3)`
        }
      );
    }
    return merge(super.updates, {
      style,
      $: {
        inner: {
          style: {
            color: 'inherit'
          }
        }
      }
    });
  }

}


customElements.define('elix-arrow-direction-button', ArrowDirectionButton);
export default ArrowDirectionButton;
