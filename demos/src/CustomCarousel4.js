import { getSuperProperty } from '../../src/workarounds.js';
import * as symbols from '../../src/symbols.js';
import Carousel from '../../src/Carousel.js';
import PageNumbersMixin from '../../src/PageNumbersMixin.js';


const Base =
  PageNumbersMixin(
    Carousel
  );


// Shows creating a carousel with custom mixins.
class CustomCarousel extends Base {

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CustomCarousel, symbols.template);
    this[PageNumbersMixin.wrap](result.content);
    return result;
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
