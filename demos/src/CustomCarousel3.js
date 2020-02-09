import * as internal from "../../src/internal.js";
import * as template from "../../src/core/template.js";
import Carousel from "../../src/Carousel.js";

// Shows how to change the glyphs used in the arrow buttons.
class CustomCarousel extends Carousel {
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
    return result;
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
