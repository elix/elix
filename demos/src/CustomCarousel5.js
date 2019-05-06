import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import Carousel from '../../src/Carousel.js';
import CustomArrowButton from './CustomArrowButton.js';
import CustomPageDot from './CustomPageDot.js';
import PageNumbersMixin from '../../src/PageNumbersMixin.js';


const Base =
  PageNumbersMixin(
    Carousel
  );


// Customize everything.
class CustomCarousel extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      arrowButtonRole: CustomArrowButton,
      proxyRole: CustomPageDot
    });
  }

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
    leftSlot.textContent = "↫";
    const rightSlot = result.content.querySelector('slot[name="arrowButtonRight"]');
    rightSlot.textContent = "↬";
    // Add page numbers.
    this[PageNumbersMixin.wrap](result.content);
    return result;
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
