import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import Carousel from "../../src/base/Carousel.js";

// Shows how to change the glyphs used in the arrow buttons.
class CustomCarousel extends Carousel {
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

    result.content.append(
      template.html`
        <style>
          .arrowButton {
            font-size: 28px;
            font-weight: bold;
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
