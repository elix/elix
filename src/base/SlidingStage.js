import * as fractionalSelection from "./fractionalSelection.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import EffectMixin from "./EffectMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = EffectMixin(
  LanguageDirectionMixin(SingleSelectionMixin(SlotItemsMixin(ReactiveElement)))
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
 * @mixes EffectMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 */
class SlidingStage extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      orientation: "horizontal",
      selectionRequired: true
    });
  }

  get orientation() {
    return this[internal.state].orientation;
  }
  set orientation(orientation) {
    this[internal.setState]({ orientation });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (
      changed.enableEffects ||
      changed.orientation ||
      changed.selectedIndex ||
      changed.swipeFraction
    ) {
      const { orientation, rightToLeft, selectedIndex, items } = this[
        internal.state
      ];
      const vertical = orientation === "vertical";
      const sign = vertical ? -1 : rightToLeft ? 1 : -1;
      const swiping = this[internal.state].swipeFraction != null;
      const swipeFraction = this[internal.state].swipeFraction || 0;
      let translation;
      if (selectedIndex >= 0) {
        const selectionFraction = selectedIndex + sign * swipeFraction;
        const count = items ? items.length : 0;
        const dampedSelection = fractionalSelection.dampenListSelection(
          selectionFraction,
          count
        );
        translation = sign * dampedSelection * 100;
      } else {
        translation = 0;
      }

      const slidingStageContent = this[internal.ids].slidingStageContent;
      const axis = vertical ? "Y" : "X";
      slidingStageContent.style.transform = `translate${axis}(${translation}%)`;

      const showTransition = this[internal.state].enableEffects && !swiping;
      slidingStageContent.style.transition = showTransition
        ? "transform 0.25s"
        : "none";
    }
    if (changed.orientation) {
      const { orientation } = this[internal.state];
      const vertical = orientation === "vertical";
      this[internal.ids].slidingStageContent.style.flexDirection = vertical
        ? "column"
        : "";
    }
  }

  get swipeFraction() {
    return this[internal.state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    const parsed = swipeFraction && parseFloat(swipeFraction);
    this[internal.setState]({
      swipeFraction: parsed
    });
  }

  get [internal.template]() {
    // The trick here is to give the slotted elements a flex-basis of 100%. This
    // makes them each as big as the component, spreading them out equally. The
    // slidingStageContent container will only big as big as the host too, but
    // all the elements slotted inside it will still be visible even if they
    // fall outside its bounds. By translating the container left or right, we
    // can cause any individual slotted item to become the sole visible item.
    return template.html`
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
