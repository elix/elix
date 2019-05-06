import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import Carousel from '../../src/Carousel.js';


// Shows how to change the glyphs used in the arrow buttons.
class CustomCarousel extends Carousel {

  get [symbols.template]() {
    const result = template.concat(super[symbols.template], template.html`
      <style>
        .arrowButton {
          font-size: 28px;
          font-weight: bold;
          padding: 0.5em;
        }
      </style>
    `);
    // Replace icons with glyphs.
    const leftSlot = result.content.querySelector('slot[name="arrowButtonLeft"]');
    if (leftSlot) {
      leftSlot.textContent = "↫";
    }
    const rightSlot = result.content.querySelector('slot[name="arrowButtonRight"]');
    if (rightSlot) {
      rightSlot.textContent = "↬";
    }
    return result;
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
