import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import { defaultState, template } from "./internal.js";

const Base = AriaRoleMixin(ReactiveElement);

/**
 * Background element shown behind an overlay's primary content
 *
 * The backdrop is transparent by default, suggesting to the user that the
 * overlay is modeless, and they can click through it to reach the background
 * elements. For a modal variant, see [ModalBackdrop](ModalBackdrop).
 *
 * @inherits ReactiveElement
 * @mixes AriaRoleMixin
 */
class Backdrop extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      role: "none",
    });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-block;
          height: 100%;
          left: 0;
          position: fixed;
          top: 0;
          touch-action: manipulation;
          width: 100%;
        }
      </style>
      <slot></slot>
    `;
  }
}

export default Backdrop;
