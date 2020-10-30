import {
  defaultState,
  ids,
  rendered,
  setState,
  state,
  template
} from "../../src/base/internal.js";
import LanguageDirectionMixin from "../../src/base/LanguageDirectionMixin.js";
import layoutPopup from "../../src/base/layoutPopup.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = ReactiveElement;

export default class PopupLayoutTest extends LanguageDirectionMixin(Base) {
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

  [rendered](changed) {
    super[rendered](changed);

    if (changed.popupAlign || changed.popupDirection || changed.rightToLeft) {
      const { popupAlign, popupDirection, rightToLeft } = this[state];
      /** @type {any} */ const source = this[ids].source;
      /** @type {any} */ const popup = this[ids].popup;
      const sourceRect = new DOMRect(
        source.offsetLeft,
        source.offsetTop,
        source.offsetWidth,
        source.offsetHeight
      );
      const popupRect = new DOMRect(
        popup.offsetLeft,
        popup.offsetTop,
        popup.offsetWidth,
        popup.offsetHeight
      );
      const boundsRect = new DOMRect(0, 0, this.offsetWidth, this.offsetHeight);

      const layout = layoutPopup(sourceRect, popupRect, boundsRect, {
        align: popupAlign,
        direction: popupDirection,
        rightToLeft,
      });

      // Position the popup in the layout rectangle.
      const { rect } = layout;
      Object.assign(popup.style, {
        height: `${rect.height}px`,
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
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
          background: #eee;
          border: 1px solid #ccc;
          box-sizing: border-box;
          height: 60px;
          overflow: hidden;
          position: absolute;
          width: 100px;
        }
      </style>
      <div id="source" part="source"></div>
      <div id="popup" part="popup">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("popup-layout-test", PopupLayoutTest);
