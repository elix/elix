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
    Object.assign(this[symbols.descriptors], {
      arrowButton: CustomArrowButton,
      proxy: CustomPageDot
    });
  }

  get [symbols.template]() {
    const base = super[symbols.template];
    return this[PageNumbersMixin.wrap](base.content);
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
