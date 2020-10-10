import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = ReactiveElement;

export default class AdjacentPositionTest extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      neighborOrigin: null,
      neighborDirection: "row",
      sourceOrigin: null,
    });
  }

  get neighborDirection() {
    return this[state].neighborDirection;
  }
  set neighborDirection(neighborDirection) {
    this[setState]({ neighborDirection });
  }

  [render](changed) {
    super[render](changed);

    if (changed.neighborDirection) {
      const { neighborDirection } = this[state];
      /** @type {any} */ const source = this[ids].source;
      /** @type {any} */ const neighbor = this[ids].neighbor;

      const sourceRect = {
        left: source.offsetLeft,
        right: source.offsetLeft + source.offsetWidth,
        top: source.offsetTop,
        bottom: source.offsetTop + source.offsetHeight,
      };

      const mapDirectionToSourceCorner = {
        column: {
          x: "left",
          y: "bottom",
        },
        "column-reverse": {
          x: "left",
          y: "top",
        },
        row: {
          x: "right",
          y: "top",
        },
        "row-reverse": {
          x: "left",
          y: "top",
        },
      };
      const sourceCorner = mapDirectionToSourceCorner[neighborDirection];
      const sourceOrigin = {
        x: sourceRect[sourceCorner.x],
        y: sourceRect[sourceCorner.y],
      };

      let neighborOrigin;
      switch (neighborDirection) {
        case "column":
          neighborOrigin = {
            left: sourceOrigin.x,
            top: sourceOrigin.y,
          };
          break;

        case "column-reverse":
          neighborOrigin = {
            left: sourceOrigin.x,
            top: sourceOrigin.y - neighbor.offsetHeight,
          };
          break;

        case "row":
        default:
          neighborOrigin = {
            left: sourceOrigin.x,
            top: sourceOrigin.y,
          };
          break;

        case "row-reverse":
          neighborOrigin = {
            left: sourceOrigin.x - neighbor.offsetWidth,
            top: sourceOrigin.y,
          };
          break;
      }

      Object.assign(neighbor.style, {
        top: `${neighborOrigin.top}px`,
        left: `${neighborOrigin.left}px`,
      });

      console.log(sourceCorner, sourceOrigin, neighborOrigin);
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        #source,
        #neighbor {
          border: 1px solid gray;
          box-sizing: border-box;
        }

        #source {
          background: #aaa;
          height: 30px;
          width: 30px;
        }

        #neighbor {
          background: #ccc;
          height: 60px;
          position: absolute;
          width: 60px;
        }
      </style>
      <div id="source"></div>
      <div id="neighbor"></div>
    `;
  }
}

customElements.define("adjacent-position-test", AdjacentPositionTest);
