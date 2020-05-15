import { template } from "../base/internal.js";
import ModalBackdrop from "../base/ModalBackdrop.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * ModalBackdrop component in the Plain reference design system
 *
 * @inherits ModalBackdrop
 */
class PlainModalBackdrop extends ModalBackdrop {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
