import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import Carousel from "../../src/base/Carousel.js";
import CustomArrowButton from "./CustomArrowButton.js";
import CustomPageDot from "./CustomPageDot.js";
import PageNumbersMixin from "../../src/base/PageNumbersMixin.js";

const Base = PageNumbersMixin(Carousel);

// Customize everything.
class CustomCarousel extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: CustomArrowButton,
      proxyPartType: CustomPageDot
    });
  }

  get [internal.template]() {
    const result = template.concat(
      super[internal.template],
      template.html`
      <style>
        .arrowButton {
          font-size: 28px;
          font-weight: bold;
          padding: 0.5em;
        }
      </style>
    `
    );
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
    /** @type {any} */ const cast = this;
    cast[PageNumbersMixin.wrap](result.content);
    return result;
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
