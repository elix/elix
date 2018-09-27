import * as symbols from '../../src/symbols.js'
import Carousel from '../../src/Carousel.js';
import CustomArrowButton from './CustomArrowButton.js';
import CustomPageDot from './CustomPageDot.js';


// Shows how a carousel subclass can define custom roles for the arrows and dots.
class CustomCarousel extends Carousel {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      arrowButtonRole: CustomArrowButton,
      proxyRole: CustomPageDot
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
