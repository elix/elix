import * as symbols from '../../src/symbols.js';
import PageNumbersMixin from '../../src/PageNumbersMixin.js';
import Carousel from '../../src/Carousel.js';


const Base =
  PageNumbersMixin(
    Carousel
  );


// Shows creating a carousel with custom mixins.
class CustomCarousel extends Base {

  get [symbols.template]() {
    return this[PageNumbersMixin.inject](super[symbols.template]);
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
