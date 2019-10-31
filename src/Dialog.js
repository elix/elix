import * as internal from './internal.js';
import * as template from './template.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ModalBackdrop from './ModalBackdrop.js';
import Overlay from './Overlay.js';

const Base = DialogModalityMixin(FocusCaptureMixin(KeyboardMixin(Overlay)));

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
 * @part {ModalBackdrop} backdrop
 */
class Dialog extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: ModalBackdrop,
      tabIndex: -1
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    const frame = result.content.querySelector('#frame');
    /** @type {any} */ const cast = this;
    cast[FocusCaptureMixin.wrap](frame);
    return template.concat(
      result,
      template.html`
      <style>
        :host {
          height: 100%;
          left: 0;
          pointer-events: initial;
          top: 0;
          width: 100%;
        }
      </style>
    `
    );
  }
}

export default Dialog;
