import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import PlainCarousel from "../../src/plain/PlainCarousel.js";

// Shows how to change the glyphs used in the arrow buttons.
class CustomCarousel extends PlainCarousel {
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
