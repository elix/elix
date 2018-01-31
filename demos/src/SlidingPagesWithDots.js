import * as symbols from '../../src/symbols.js';
import PageDotsMixin from '../../src/PageDotsMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  PageDotsMixin(
    SlidingPages
  );


class SlidingPagesWithDots extends Base {

  get [symbols.template]() {
    return this[PageDotsMixin.inject](
      super[symbols.template]
    );
  }

}



customElements.define('sliding-pages-with-dots', SlidingPagesWithDots);
export default SlidingPagesWithDots;
