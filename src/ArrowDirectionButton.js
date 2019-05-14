import * as symbols from './symbols.js';
import * as template from './template.js';
import DarkModeMixin from './DarkModeMixin.js';
import SeamlessButton from './SeamlessButton.js';


const Base = 
  DarkModeMixin(
    SeamlessButton
  );


/**
 * Button that can be used as a left or right arrow button.
 * 
 * This component is used by [ArrowDirectionMixin](ArrowDirectionMixin) for its
 * default left/right arrow buttons.
 * 
 * @inherits SeamlessButton
 * @mixes DarkModeMixin
 */
class ArrowDirectionButton extends Base {

  [symbols.render](changed) {
    super[symbols.render](changed);
    // Wait for knowledge of dark mode to be set after initial render.
    const { darkMode } = this.state;
    if (changed.darkMode && darkMode !== null) {
      this.$.inner.classList.toggle('darkMode', darkMode);
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        #inner {
          color: rgba(0, 0, 0, 0.7);
          fill: currentcolor;
        }

        #inner:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.2);
          color: rgba(0, 0, 0, 0.8);
          cursor: pointer;
        }

        #inner:disabled {
          color: rgba(0, 0, 0, 0.3);
        }

        #inner.darkMode {
          color: rgba(255, 255, 255, 0.7);
        }

        #inner.darkMode:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }

        #inner.darkMode:disabled {
          color: rgba(255, 255, 255, 0.3);
        }
      </style>
    `);
  }

}


customElements.define('elix-arrow-direction-button', ArrowDirectionButton);
export default ArrowDirectionButton;
