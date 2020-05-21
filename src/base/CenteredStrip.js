import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import EffectMixin from "./EffectMixin.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ResizeMixin from "./ResizeMixin.js";
import SelectCurrentMixin from "./SelectCurrentMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

const Base = CursorAPIMixin(
  EffectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        LanguageDirectionMixin(
          ResizeMixin(
            SelectCurrentMixin(
              SingleSelectAPIMixin(
                SlotItemsMixin(TapCursorMixin(ReactiveElement))
              )
            )
          )
        )
      )
    )
  )
);

/**
 * Horizontal strip of items with the selected item centered
 *
 * This keeps the selected item centered unless that item is at either end of
 * the list.
 *
 * @inherits ReactiveElement
 * @mixes CursorAPIMixin
 * @mixes EffectMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes ResizeMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class CenteredStrip extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      orientation: "horizontal",
    });
  }

  get orientation() {
    return this[state].orientation;
  }
  set orientation(orientation) {
    this[setState]({ orientation });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (
      changed.clientWidth ||
      changed.enableEffects ||
      changed.rightToLeft ||
      changed.currentIndex ||
      changed.swipeFraction
    ) {
      const { orientation, rightToLeft, currentIndex } = this[state];
      const sign = rightToLeft ? 1 : -1;
      const swiping = this[state].swipeFraction != null;
      const swipeFraction = this[state].swipeFraction || 0;
      const selectionFraction = currentIndex + sign * swipeFraction;

      const vertical = orientation === "vertical";
      const leadingEdge = vertical ? "offsetTop" : "offsetLeft";
      const dimension = vertical ? "offsetHeight" : "offsetWidth";

      // @ts-ignore
      const stripContainerDimension = this[ids].stripContainer[dimension];
      // @ts-ignore
      const stripDimension = this[ids].strip[dimension];

      // It seems this method can be invoked before the strip any height/width.
      // We only render if the height/width is positive.
      if (stripDimension > 0) {
        let translation = 0; // The amount by which we'll shift content horizontally
        let justifyContent = "";
        if (stripDimension <= stripContainerDimension) {
          // Container can show all items. Center all items.
          justifyContent = "center";
        } else {
          // Items are wider than container can show.
          // Center the selected item.
          // During swipes, center a pro-rated point between the midpoints
          // of the items on either side of the fractional selection.

          const itemBeforeIndex = Math.floor(selectionFraction);
          const itemBefore = this.items && this.items[itemBeforeIndex];
          const itemBeforeCenter =
            itemBefore instanceof HTMLElement
              ? itemBefore[leadingEdge] + itemBefore[dimension] / 2
              : 0;
          const itemAfterIndex = itemBeforeIndex + 1;
          const itemAfter = this.items && this.items[itemAfterIndex];
          const itemAfterCenter =
            itemAfter instanceof HTMLElement
              ? itemAfter[leadingEdge] + itemAfter[dimension] / 2
              : 0;

          let center = 0;
          if (itemBefore && !itemAfter) {
            center = itemBeforeCenter;
          } else if (!itemBefore && itemAfter) {
            center = itemAfterCenter;
          } else if (itemBefore && itemAfter) {
            const offsetFraction = selectionFraction - itemBeforeIndex;
            // TODO: sign
            center =
              itemBeforeCenter +
              offsetFraction * (itemAfterCenter - itemBeforeCenter);
          }
          if (!vertical && rightToLeft) {
            center = stripDimension - center;
          }

          // Try to center the selected item.
          translation = center - stripContainerDimension / 2;

          // Constrain x to avoid showing space on either end.
          translation = Math.max(translation, 0);
          translation = Math.min(
            translation,
            stripDimension - stripContainerDimension
          );

          translation *= sign;
        }

        const axis = vertical ? "Y" : "X";
        const transform = `translate${axis}(${translation}px)`;
        const showTransition = this[state].enableEffects && !swiping;
        Object.assign(this[ids].strip.style, {
          transform,
          transition: showTransition ? "transform 0.25s" : "none",
        });

        this[ids].stripContainer.style.justifyContent = justifyContent;
      }
    }
    if (changed.items || changed.currentIndex) {
      // Apply `selected` style to the selected item only.
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("selected", index === currentIndex);
        });
      }
    }
    if (changed.orientation) {
      const flexDirection =
        this[state].orientation === "horizontal" ? "" : "column";
      this[ids].stripContainer.style.flexDirection = flexDirection;
      this[ids].strip.style.flexDirection = flexDirection;
    }
  }

  get swipeFraction() {
    return this[state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[setState]({ swipeFraction });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          cursor: default;
          display: inline-flex;
          -webkit-tap-highlight-color: transparent;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
        }

        #stripContainer {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        #strip {
          display: inline-flex;
          position: relative;
          transition: transform 0.25s;
        }
      </style>
      <div id="stripContainer" role="none">
        <div id="strip" role="none">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

export default CenteredStrip;
