import AttributeMarshallingMixin from '../../mixins/AttributeMarshallingMixin.js';
import DialogWrapper from '../../elements/DialogWrapper.js';
import KeyboardMixin from '../../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../../mixins/OpenCloseMixin.js';
import ShadowReferencesMixin from '../../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin.js';
import symbols from '../../mixins/symbols.js';


const mixins = [
  AttributeMarshallingMixin,
  KeyboardMixin,
  OpenCloseMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


class SampleDialogCore extends base {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.$.okButton.addEventListener('click', () => {
      this.close('OK');
    });
  }

  get [symbols.template]() {
    return `
      <style>
        #container {
          padding: 1em;
        }

        #buttonContainer {
          margin-top: 1em;
        }

        button {
          font-family: inherit;
          font-size: inherit;
        }
      </style>
      <div id="container">
        <slot></slot>
        <div id="buttonContainer">
          <button id="okButton">OK</button>
        </div>
      </div>
    `;
  }

}


class SampleDialog extends DialogWrapper(SampleDialogCore) {}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
