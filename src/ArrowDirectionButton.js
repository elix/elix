import * as internal from './internal.js';
import * as template from './template.js';
import DarkModeMixin from './DarkModeMixin.js';
import SeamlessButton from './SeamlessButton.js';

const Base = DarkModeMixin(SeamlessButton);

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
  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    // Wait for knowledge of dark mode to be set after initial render.
    const { darkMode } = this[internal.state];
    if (changed.darkMode && darkMode !== null) {
      this[internal.ids].inner.classList.toggle('darkMode', darkMode);
    }
  }

  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
      <style>
        :host {
          color: rgba(0, 0, 0, 0.7);
        }

        :host(:hover:not([disabled]))  {
          background: rgba(0, 0, 0, 0.2);
          color: rgba(0, 0, 0, 0.8);
          cursor: pointer;
        }

        :host([disabled]) {
          color: rgba(0, 0, 0, 0.3);
        }

        #inner {
          fill: currentcolor;
        }

        #inner:hover:not(:disabled) {
        }

        #inner:disabled {
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
    `
    );
  }
}

export default ArrowDirectionButton;
