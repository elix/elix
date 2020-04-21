import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import CustomArrowButton from "./CustomArrowButton.js";
import CustomPageDot from "./CustomPageDot.js";
import PageNumbersMixin from "../../src/base/PageNumbersMixin.js";
import PlainCarousel from "../../src/plain/PlainCarousel.js";

const Base = PageNumbersMixin(PlainCarousel);

// Customize everything.
class CustomCarousel extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: CustomArrowButton,
      proxyPartType: CustomPageDot,
    });
  }

  get [internal.template]() {
    const result = super[internal.template];

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
      template.html`
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
