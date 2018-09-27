import { getSuperProperty } from '../../src/workarounds.js';
import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
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
    return Object.assign({}, super.defaultState, {
      arrowButtonRole: CustomArrowButton,
      proxyRole: CustomPageDot
    });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CustomCarousel, symbols.template);
    // Replace icons with glyphs.
    const leftSlot = result.content.querySelector('slot[name="arrowButtonLeft"]');
    leftSlot.textContent = "↫";
    const rightSlot = result.content.querySelector('slot[name="arrowButtonRight"]');
    rightSlot.textContent = "↬";
    // Add page numbers.
    this[PageNumbersMixin.wrap](result.content);
    return result;
  }

  get updates() {
    const arrowButtonStyle = {
      'font-size': '28px',
      'font-weight': 'bold',
      padding: '0.5em'
    };
    return merge(super.updates, {
      $: {
        arrowButtonLeft: {
          style: arrowButtonStyle
        },
        arrowButtonRight: {
          style: arrowButtonStyle
        }
      }
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
