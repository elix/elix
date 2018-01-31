import * as symbols from './symbols.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import CustomTagsMixin from './CustomTagsMixin.js';
import PageDotsMixin from './PageDotsMixin.js';
import SlidingPages from './SlidingPages.js';


const Base =
  ArrowDirectionMixin(
  CustomTagsMixin(
  PageDotsMixin(
    SlidingPages
  )));


/**
 * A typical carousel with a sliding effect. The user can move between items with
 * touch, the mouse, the keyboard, or a trackpad.
 * 
 * This carousel lets the user navigate the selection with left/right arrow
 * buttons provided by [ArrowDirectionMixin](ArrowDirectionMixin) and small dots
 * at the bottom of the carousel provided by [PageDotsMixin](PageDotsMixin). For
 * a plain carousel without those extras, see [SlidingPages](SlidingPages).
 * 
 * @inherits SlidingPages
 * @mixes ArrowDirectionMixin
 * @mixes PageDotsMixin
 */
class SlidingCarousel extends Base {

  get [symbols.template]() {
    return this[ArrowDirectionMixin.inject](
      this[PageDotsMixin.inject](
        super[symbols.template]
      )
    );
  }

}


customElements.define('elix-sliding-carousel', SlidingCarousel);
export default SlidingCarousel;
