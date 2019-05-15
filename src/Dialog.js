import * as symbols from './symbols.js';
import * as template from './template.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ModalBackdrop from './ModalBackdrop.js';
import Overlay from './Overlay.js';


const Base =
  DialogModalityMixin(
  FocusCaptureMixin(
  KeyboardMixin(
    Overlay
  )));


/**
 * Basic modal overlay that the user typically dismisses with an explicit action.
 * 
 * This component presents its children as a basic modal dialog which appears on
 * top of the main page content and which the user must interact with before
 * they can return to the page.
 * 
 * @inherits Overlay
 * @mixes DialogModalityMixin
 * @mixes KeyboardMixin
 * @elementrole {ModalBackdrop} backdrop
 */
class Dialog extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      backdropRole: ModalBackdrop,
      tabIndex: -1
    });
  }

  get [symbols.template]() {
    const result = super[symbols.template];
    const frame = result.content.querySelector('#frame');
    this[FocusCaptureMixin.wrap](frame);
    return template.concat(result, template.html`
      <style>
        :host {
          pointer-events: initial;
        }
      </style>
    `);
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
