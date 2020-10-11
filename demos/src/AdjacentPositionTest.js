import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import LanguageDirectionMixin from "../../src/base/LanguageDirectionMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = ReactiveElement;

export default class AdjacentPositionTest extends LanguageDirectionMixin(Base) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      neighborAlign: "start",
      neighborOrigin: null,
      neighborDirection: "row",
      sourceOrigin: null,
    });
  }

  get neighborAlign() {
    return this[state].neighborAlign;
  }
  set neighborAlign(neighborAlign) {
    this[setState]({ neighborAlign });
  }

  get neighborDirection() {
    return this[state].neighborDirection;
  }
  set neighborDirection(neighborDirection) {
    this[setState]({ neighborDirection });
  }

  [render](changed) {
    super[render](changed);

    if (
      changed.neighborAlign ||
      changed.neighborDirection ||
      changed.rightToLeft
    ) {
      const { neighborAlign, neighborDirection, rightToLeft } = this[state];
      /** @type {any} */ const source = this[ids].source;
      /** @type {any} */ const neighbor = this[ids].neighbor;

      // Work out which axes we're working with.
      const mainAxis = {
        column: "vertical",
        "column-reverse": "vertical",
        row: "horizontal",
        "row-reverse": "horizontal",
      }[neighborDirection];
      const mapAxisToPerpendicularAxis = {
        horizontal: "vertical",
        vertical: "horizontal",
      };
      const crossAxis = mapAxisToPerpendicularAxis[mainAxis];

      // We'll need to flip certain parts of the logic for right-to-left;
      const flipMainAxis = rightToLeft && mainAxis === "horizontal";
      const flipCrossAxis = rightToLeft && crossAxis === "horizontal";

      // Determine how we'll measure things on these axes.
      const mapAxisToOffsetStartProperty = {
        horizontal: "offsetLeft",
        vertical: "offsetTop",
      };
      const mainAxisOffsetStartProperty =
        mapAxisToOffsetStartProperty[mainAxis];
      const crossAxisOffsetStartProperty =
        mapAxisToOffsetStartProperty[crossAxis];
      const mapAxisToOffsetSizeProperty = {
        horizontal: "offsetWidth",
        vertical: "offsetHeight",
      };
      const mapAxisToStartProperty = {
        horizontal: "left",
        vertical: "top",
      };
      const mainOffsetSizeProperty = mapAxisToOffsetSizeProperty[mainAxis];
      const crossOffsetSizeProperty = mapAxisToOffsetSizeProperty[crossAxis];

      // Determine whether physical coordinates increase along the main axis.
      const directionPositive = {
        column: true,
        "column-reverse": false,
        row: true,
        "row-reverse": false,
      }[neighborDirection];
      const mainAxisPositive = flipMainAxis !== directionPositive;

      // Measure the source and neighbor.
      const sourceMainSize = source[mainOffsetSizeProperty];
      const neighborMainSize = neighbor[mainOffsetSizeProperty];
      const sourceCrossSize = source[crossOffsetSizeProperty];
      const neighborCrossSize = neighbor[crossOffsetSizeProperty];

      // Determine the offset of the source's end along the main axis.
      const sourceMainStart = source[mainAxisOffsetStartProperty];
      const sourceMainEnd = mainAxisPositive
        ? sourceMainStart + sourceMainSize
        : sourceMainStart;

      // Determine the neighbor's start so it touches the source's end.
      const neighborMainStart = mainAxisPositive
        ? sourceMainEnd
        : sourceMainEnd - neighborMainSize;

      // Determine the source's start on the cross axis.
      const sourceCrossStartOffset = source[crossAxisOffsetStartProperty];

      // Determine the neighbor's start on the cross axis which will give the
      // desired cross-axis alignment with the source.
      const normalizedAlign = flipCrossAxis
        ? { start: "end", center: "center", end: "start" }[neighborAlign]
        : neighborAlign;
      const crossAdjustment = {
        start: 0,
        center: (neighborCrossSize - sourceCrossSize) / 2,
        end: neighborCrossSize - sourceCrossSize,
      }[normalizedAlign];
      const neighborCrossStart = sourceCrossStartOffset - crossAdjustment;

      // Determine the neighbor's physical (top, left) coordinate from its
      // logical main- and cross-axis start properties.
      const mainStartProperty = mapAxisToStartProperty[mainAxis];
      const crossStartProperty = mapAxisToStartProperty[crossAxis];
      const neighborOrigin = {
        [mainStartProperty]: neighborMainStart,
        [crossStartProperty]: neighborCrossStart,
      };

      // Position the neighbor at that physical coordinate.
      Object.assign(neighbor.style, {
        top: `${neighborOrigin.top}px`,
        left: `${neighborOrigin.left}px`,
      });
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
          box-sizing: border-box;
        }

        #source {
          background: #999;
          height: 30px;
          width: 50px;
        }

        #neighbor {
          background: #ddd;
          height: 60px;
          position: absolute;
          width: 100px;
        }
      </style>
      <div id="source"></div>
      <div id="neighbor"></div>
    `;
  }
}

customElements.define("adjacent-position-test", AdjacentPositionTest);
