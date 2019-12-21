import * as internal from "../../src/internal.js";
import Carousel from "../../src/Carousel.js";
import PageNumbersMixin from "../../src/PageNumbersMixin.js";

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
