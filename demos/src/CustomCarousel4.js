import * as internal from "../../src/base/internal.js";
import PageNumbersMixin from "../../src/base/PageNumbersMixin.js";
import PlainCarousel from "../../src/plain/PlainCarousel.js";

const Base = PageNumbersMixin(PlainCarousel);

// Shows creating a carousel with custom mixins.
class CustomCarousel extends Base {
  get [internal.template]() {
    const result = super[internal.template];
    const explorerContainer = result.content.getElementById(
      "explorerContainer"
    );
    if (explorerContainer) {
      /** @type {any} */ const cast = this;
      cast[PageNumbersMixin.wrap](explorerContainer);
    }
    return result;
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
