import * as internal from './internal.js';
import * as template from './template.js';
import Button from './Button.js';

/**
 * A button with no border or background in its normal state.
 *
 * `SeamlessButton` is useful for clickable subelements inside a more complex
 * component.
 *
 * @inherits Button
 */
class SeamlessButton extends Button {
  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
      <style>
        #inner {
          background: none;
          border: none;
          padding: 0;
        }
      </style>
    `
    );
  }
}

export default SeamlessButton;
