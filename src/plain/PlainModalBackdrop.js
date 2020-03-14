import * as internal from "../base/internal.js";
import html from "../core/html.js";
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
      html`
        <style>
          :host {
            background: rgba(0, 0, 0, 0.2);
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainModalBackdrop;
