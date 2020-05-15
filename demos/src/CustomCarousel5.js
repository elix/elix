import { defaultState, template } from "../../src/base/internal.js";
import PageNumbersMixin from "../../src/base/PageNumbersMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import PlainCarousel from "../../src/plain/PlainCarousel.js";
import CustomArrowButton from "./CustomArrowButton.js";
import CustomPageDot from "./CustomPageDot.js";

const Base = PageNumbersMixin(PlainCarousel);

// Customize everything.
class CustomCarousel extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      arrowButtonPartType: CustomArrowButton,
      proxyPartType: CustomPageDot,
    });
  }

  get [template]() {
    const result = super[template];

    // Replace icons with glyphs.
    const previousSlot = result.content.querySelector(
      'slot[name="arrowButtonPrevious"]'
    );
    if (previousSlot) {
      previousSlot.textContent = "↫";
    }
    const nextSlot = result.content.querySelector(
      'slot[name="arrowButtonNext"]'
    );
    if (nextSlot) {
      nextSlot.textContent = "↬";
    }

    // Add page numbers.
    const explorerContainer = result.content.getElementById(
      "explorerContainer"
    );
    if (explorerContainer) {
      /** @type {any} */ const cast = this;
      cast[PageNumbersMixin.wrap](explorerContainer);
    }

    result.content.append(
      templateFrom.html`
        <style>
          .arrowButton {
            padding: 0.5em;
          }
        </style>
      `.content
    );

    return result;
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
