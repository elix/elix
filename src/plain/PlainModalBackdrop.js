import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import ModalBackdrop from "../base/ModalBackdrop.js";

/**
 * ModalBackdrop component in the Plain reference design system
 *
 * @inherits ModalBackdrop
 */
class PlainModalBackdrop extends ModalBackdrop {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            background: black;
            opacity: 0.2;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainModalBackdrop;
