import * as internal from "../base/internal.js";
import html from "../core/html.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";
import Toast from "../base/Toast.js";

/**
 * @inherits Toast
 * @part {PlainOverlayFrame} frame
 */
class PlainToast extends Toast {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
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

          [part~="frame"] {
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
