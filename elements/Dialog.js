import * as props from '../mixins/props.js';
// import FocusCaptureWrapper from './FocusCaptureWrapper.js';
import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import ModalBackdrop from './ModalBackdrop.js'; // eslint-disable-line no-unused-vars
import OverlayMixin from '../mixins/OverlayMixin.js';
import symbols from '../mixins/symbols.js';
// import VisualStateMixin from '../mixins/VisualStateMixin.js';


const Base =
  DialogModalityMixin(
  // FocusCaptureWrapper(
  KeyboardMixin(
  OverlayMixin(
  // VisualStateMixin(
    ElementBase
  )));


/**
 * This component presents its children as a basic modal dialog which appears on
 * top of the main page content and which the user must interact with before
 * they can return to the page.
 * 
 * Dialog uses `BackdropWrapper` to add a backdrop behind the main overlay
 * content. Both the backdrop and the dialog itself can be styled.
 * 
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes BackdropWrapper
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureWrapper
 * @mixes KeyboardMixin
 * @mixes OverlayMixin
 * @mixes ShadowTemplateMixin
 */
class Dialog extends Base {

  backdropProps() {
    return super.backdropProps ? super.backdropProps() : {};
  }

  contentProps() {
    const base = super.contentProps ? super.contentProps() : {};
    return props.merge(base, {
      style: {
        'background': 'white',
        'border': '1px solid rgba(0, 0, 0, 0.2)',
        'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.5)',
        'position': 'relative'
      }
    });
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    const display = this.closed ?
      null :
      base.style && base.style.display || 'flex';
    return props.merge(base, {
      style: {
        'alignItems': 'center',
        display,
        'flex-direction': 'column',
        'height': '100%',
        'justify-content': 'center',
        'left': 0,
        'outline': 'none',
        'position': 'fixed',
        'top': 0,
        '-webkit-tap-highlight-color': 'transparent',
        'width': '100%'
      }
    });
  }

  get [symbols.template]() {
    return `
      <elix-modal-backdrop style="${props.formatStyleProps(this.backdropProps().style)}"></elix-modal-backdrop>
      <div id="content" style="${props.formatStyleProps(this.contentProps().style)}">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
