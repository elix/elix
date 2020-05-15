import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import EffectMixin from "./EffectMixin.js";
import * as fractionalSelection from "./fractionalSelection.js";
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
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = CursorAPIMixin(
  EffectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        LanguageDirectionMixin(
          SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement))
        )
      )
    )
  )
);

/**
 * Slides between selected items on a horizontal axis
 *
 * This displays a single item completely visible at a time. When changing which
 * item is selected, it displays a simple sliding transition.
 *
 * This component is used as the main stage for a [Carousel](Carousel).
 *
 * @inherits ReactiveElement
 * @mixes CursorAPIMixin
 * @mixes EffectMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 */
class SlidingStage extends Base {
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "swipe-fraction") {
      this.swipeFraction = parseFloat(newValue);
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

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
      changed.currentIndex ||
      changed.enableEffects ||
      changed.orientation ||
      changed.swipeFraction
    ) {
      const { orientation, rightToLeft, currentIndex, items } = this[state];
      const vertical = orientation === "vertical";
      const sign = vertical ? -1 : rightToLeft ? 1 : -1;
      const swiping = this[state].swipeFraction != null;
      const swipeFraction = this[state].swipeFraction || 0;
      let translation;
      if (currentIndex >= 0) {
        const selectionFraction = currentIndex + sign * swipeFraction;
        const count = items ? items.length : 0;
        const dampedSelection = fractionalSelection.dampenListSelection(
          selectionFraction,
          count
        );
        translation = sign * dampedSelection * 100;
      } else {
        translation = 0;
      }

      const slidingStageContent = this[ids].slidingStageContent;
      const axis = vertical ? "Y" : "X";
      slidingStageContent.style.transform = `translate${axis}(${translation}%)`;

      const showTransition = this[state].enableEffects && !swiping;
      slidingStageContent.style.transition = showTransition
        ? "transform 0.25s"
        : "none";
    }
    if (changed.orientation) {
      const { orientation } = this[state];
      const vertical = orientation === "vertical";
      this[ids].slidingStageContent.style.flexDirection = vertical
        ? "column"
        : "";
    }
  }

  get swipeFraction() {
    return this[state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[setState]({ swipeFraction });
  }

  get [template]() {
    // The trick here is to give the slotted elements a flex-basis of 100%. This
    // makes them each as big as the component, spreading them out equally. The
    // slidingStageContent container will only big as big as the host too, but
    // all the elements slotted inside it will still be visible even if they
    // fall outside its bounds. By translating the container left or right, we
    // can cause any individual slotted item to become the sole visible item.
    return templateFrom.html`
      <style>
        :host {
          display: inline-flex;
          overflow: hidden;
          position: relative;
        }

        #slidingStageContent {
          display: flex;
          height: 100%;
          min-width: 100%;
          will-change: transform;
        }

        ::slotted(*) {
          flex: 0 0 100%;
          max-width: 100%; /* For Firefox */
        }
      </style>
      <div id="slidingStageContent" role="none">
        <slot></slot>
      </div>
    `;
  }
}

export default SlidingStage;
