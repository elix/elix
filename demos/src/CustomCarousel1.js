import './CustomArrowButton.js';
import * as symbols from '../../src/symbols.js';
import { merge } from '../../src/updates.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import PageDotsMixin from '../../src/PageDotsMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  ArrowDirectionMixin(
  PageDotsMixin(
    SlidingPages
  ));


class CustomCarousel extends Base {

  get [symbols.template]() {
    return this[ArrowDirectionMixin.inject](
      this[PageDotsMixin.inject](
        super[symbols.template]
      )
    );
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
