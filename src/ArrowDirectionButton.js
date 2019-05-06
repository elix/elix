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
 * @mixes DarkModeMixin
 * @mixes HoverMixin
 */
class ArrowDirectionButton extends Base {

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.darkMode || changed.hover || changed.innerProperties) {
      const { darkMode, innerProperties } = state;
      // Wait for knowledge of dark mode to be set after initial render.
      if (darkMode !== null) {
        const disabled = innerProperties ?
          innerProperties.disabled :
          false;

        // Use white color value in dark mode, or black value in light mode.
        const value = darkMode ? 255 : 0;
        Object.assign(this.style,
          {
            background: '',
            color: `rgba(${value}, ${value}, ${value}, 0.7)`,
            cursor: ''
          },
          state.hover && !disabled && {
            background: `rgba(${value}, ${value}, ${value}, 0.2)`,
            color: `rgba(${value}, ${value}, ${value}, 0.8)`,
            cursor: 'pointer'
          },
          disabled && {
            color: `rgba(${value}, ${value}, ${value}, 0.3)`
          }
        );
      }
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        #inner {
          fill: currentcolor;
        }
      </style>
    `);
  }

}


customElements.define('elix-arrow-direction-button', ArrowDirectionButton);
export default ArrowDirectionButton;
