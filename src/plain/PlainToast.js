import { defaultState, template } from "../base/internal.js";
import Toast from "../base/Toast.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";

/**
 * @inherits Toast
 * @part {PlainOverlayFrame} frame
 */
class PlainToast extends Toast {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      framePartType: PlainOverlayFrame,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            align-items: initial;
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: initial;
            left: 0;
            outline: none;
            pointer-events: none;
            top: 0;
            -webkit-tap-highlight-color: transparent;
            width: 100%;
          }

          [part~=frame] {
            margin: 1em;
            transition-duration: 0.25s;
            transition-property: opacity, transform;
            will-change: opacity, transform;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainToast;
