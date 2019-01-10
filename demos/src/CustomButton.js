import { getSuperProperty } from '../../src/workarounds.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import Button from '../../src/Button.js';


class CustomButton extends Button {

  get [symbols.template]() {
    // Next line is same as: const base = super[symbols.template]
    const base = getSuperProperty(this, CustomButton, symbols.template);
    return template.concat(base, template.html`
      <style>
        #inner {
          background: white;
          border-radius: 0.5em;
          border: 2px solid rgba(255, 0, 0, 0.2);
          padding: 0.5em 1em;
        }
      </style>
    `);
  }

}


customElements.define('custom-button', CustomButton);
export default CustomButton;
