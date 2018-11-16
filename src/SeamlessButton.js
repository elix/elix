import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Button from './Button.js';
import ForwardFocusMixin from './ForwardFocusMixin.js';


const Base =
  ForwardFocusMixin(
    Button
  );


/**
 * A button with no border or background in its normal state.
 * 
 * `SeamlessButton` is useful for clickable subelements inside a more complex
 * component.
 * 
 * @inherits Button
 */
class SeamlessButton extends Base {

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, SeamlessButton, symbols.template);
    const styleTemplate = template.html`
      <style>
        #inner {
          background: none;
          border: none;
          padding: 0;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
  }

}


customElements.define('elix-seamless-button', SeamlessButton);
export default SeamlessButton;
