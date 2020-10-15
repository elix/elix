import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import LanguageDirectionMixin from "../../src/base/LanguageDirectionMixin.js";
import positionPopup from "../../src/base/positionPopup.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = ReactiveElement;

export default class PopupPositionTest extends LanguageDirectionMixin(Base) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      popupAlign: "start",
      popupDirection: "row",
    });
  }

  get popupAlign() {
    return this[state].popupAlign;
  }
  set popupAlign(popupAlign) {
    this[setState]({ popupAlign });
  }

  get popupDirection() {
    return this[state].popupDirection;
  }
  set popupDirection(popupDirection) {
    this[setState]({ popupDirection });
  }

  [render](changed) {
    super[render](changed);

    if (changed.popupAlign || changed.popupDirection || changed.rightToLeft) {
      const { popupAlign, popupDirection, rightToLeft } = this[state];
      /** @type {any} */ const source = this[ids].source;
      /** @type {any} */ const popup = this[ids].popup;
      const bounds = {
        top: this.offsetTop,
        left: this.offsetLeft,
        right: this.offsetLeft + this.offsetWidth,
        bottom: this.offsetTop + this.offsetHeight,
      };

      const popupOrigin = positionPopup(source, popup, bounds, {
        popupAlign,
        popupDirection,
        rightToLeft,
      });

      // Position the popup at that physical coordinate.
      Object.assign(popup.style, {
        top: `${popupOrigin.top}px`,
        left: `${popupOrigin.left}px`,
      });
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          border: 1px dotted #ddd;
          display: inline-block;
          position: relative;
        }

        #source,
        #popup {
          box-sizing: border-box;
        }

        #source {
          background: #999;
          height: 30px;
          width: 50px;
        }

        #popup {
          background: #ddd;
          height: 60px;
          position: absolute;
          width: 100px;
        }
      </style>
      <div id="source"></div>
      <div id="popup"></div>
    `;
  }
}

customElements.define("popup-position-test", PopupPositionTest);
