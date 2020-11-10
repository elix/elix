import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import TouchSwipeMixin from "../../src/base/TouchSwipeMixin.js";
import TrackpadSwipeMixin from "../../src/base/TrackpadSwipeMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = TouchSwipeMixin(TrackpadSwipeMixin(ReactiveElement));

class SwipeDemo extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      swipeAxis: "horizontal",
    });
  }

  [render](/** @type {PlainObject} */ changed) {
    super[render](changed);
    const { swipeAxis, swipeFraction } = this[state];
    const vertical = swipeAxis === "vertical";
    if (changed.swipeAxis) {
      this.style.flexDirection = vertical ? "row" : "column";
      Object.assign(this[ids].block.style, {
        height: vertical ? "100%" : "1em",
        width: vertical ? "1em" : "100%",
      });
      Object.assign(this[ids].container.style, {
        "flex-direction": vertical ? "row-reverse" : "column",
        "justify-content": vertical ? "flex-end" : "center",
      });
      this[ids].empty.style.display = vertical ? "none" : "block";
      this[ids].space.style.display = vertical ? "none" : "block";
    }
    if (changed.swipeFraction) {
      const axis = vertical ? "Y" : "X";
      this[ids].block.style.transform =
        swipeFraction !== null
          ? `translate${axis}(${swipeFraction * 100}%)`
          : "";
      this[ids].swipeFraction.textContent =
        swipeFraction !== null ? swipeFraction.toFixed(3) : "—";
    }
  }

  get swipeAxis() {
    return this[state].swipeAxis;
  }
  set swipeAxis(swipeAxis) {
    this[setState]({ swipeAxis });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .section {
          flex: 1;
        }

        #message {
          font-size: smaller;
          padding: 1em;
        }

        #container {
          align-items: center;
          display: flex;
          flex-direction: column;
          font-size: 48px;
          justify-content: center;
          text-align: center;
        }

        #block {
          background: linear-gradient(to right, lightgray, gray);
          height: 1em;
          width: 100%;
          will-change: transform;
        }
      </style>
      <div class="section">
        <div id="message">
          <slot></slot>
        </div>
      </div>
      <div id="container" class="section">
        <div id="swipeFraction"></div>
        <div id="block"></div>
        <div id="space">&nbsp;</div>
      </div>
      <div id="empty" class="section"></div>
    `;
  }
}

customElements.define("swipe-demo", SwipeDemo);
export default SwipeDemo;
