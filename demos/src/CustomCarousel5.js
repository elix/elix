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

  constructor() {
    super();
    Object.assign(this[symbols.roles], {
      arrowButton: CustomArrowButton,
      proxy: CustomPageDot
    });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CustomCarousel, symbols.template);
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
          style: arrowButtonStyle,
          textContent: "↫"
        },
        arrowButtonRight: {
          style: arrowButtonStyle,
          textContent: "↬"
        }
      }
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
