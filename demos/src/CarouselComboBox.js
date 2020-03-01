import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import AutoCompleteComboBox from "../../src/plain/PlainAutoCompleteComboBox.js";
import Carousel from "../../src/plain/PlainCarousel.js";

class CarouselComboBox extends AutoCompleteComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      listPartType: Carousel
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          [part~="list"] {
            background: black;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default CarouselComboBox;
customElements.define("carousel-combo-box", CarouselComboBox);
