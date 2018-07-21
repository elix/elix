import * as symbols from '../../src/symbols.js'
import Carousel from '../../src/Carousel.js';
import CustomArrowButton from './CustomArrowButton.js';
import CustomPageDot from './CustomPageDot.js';


// Shows how a carousel subclass can define custom tags for the arrows and dots.
class CustomCarousel extends Carousel {

  constructor() {
    super();
    Object.assign(this[symbols.descriptors], {
      arrowButton: CustomArrowButton,
      proxy: CustomPageDot
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
