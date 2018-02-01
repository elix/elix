import * as symbols from '../../src/symbols.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import PageDotsMixin from '../../src/PageDotsMixin.js';
import PageNumbersMixin from './PageNumbersMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  ArrowDirectionMixin(
  PageDotsMixin(
  PageNumbersMixin(
    SlidingPages
  )));


// Shows creating a carousel with custom mixins.
class CustomCarousel extends Base {

  get [symbols.template]() {
    return this[ArrowDirectionMixin.inject](
      this[PageDotsMixin.inject](
        this[PageNumbersMixin.inject](
          super[symbols.template]
        )
      )
    );
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
