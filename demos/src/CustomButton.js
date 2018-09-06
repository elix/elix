import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import Button from '../../src/Button.js';
import { getSuperProperty } from '../../src/workarounds.js';


class CustomButton extends Button {

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CustomButton, symbols.template);
    const styleTemplate = template.html`
      <style>
        #inner {
          background: white;
          border-radius: 0.5em;
          border: 2px solid rgba(255, 0, 0, 0.2);
          padding: 0.5em 1em;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
  }

}


customElements.define('custom-button', CustomButton);
export default CustomButton;
