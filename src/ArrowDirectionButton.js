import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import DarkModeMixin from './DarkModeMixin.js';
import HoverMixin from './HoverMixin.js';
import SeamlessButton from './SeamlessButton.js';


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

  get [symbols.template]() {
    // Next line is same as: const base = super[symbols.template]
    const base = getSuperProperty(this, ArrowDirectionButton, symbols.template);
    return template.concat(base, template.html`
      <style>
        #inner {
          fill: currentcolor;
        }
      </style>
    `);
  }

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
          cursor: ''
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
      style
    });
  }

}


customElements.define('elix-arrow-direction-button', ArrowDirectionButton);
export default ArrowDirectionButton;
