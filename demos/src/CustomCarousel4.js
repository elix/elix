import * as internal from "../../src/base/internal.js";
import Carousel from "../../src/base/Carousel.js";
import PageNumbersMixin from "../../src/base/PageNumbersMixin.js";

const Base = PageNumbersMixin(Carousel);

// Shows creating a carousel with custom mixins.
class CustomCarousel extends Base {
  get [internal.template]() {
    const result = super[internal.template];
    /** @type {any} */ const cast = this;
    cast[PageNumbersMixin.wrap](result.content);
    return result;
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
