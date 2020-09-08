import { defaultState, template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import AutoCompleteComboBox from "../../src/plain/PlainAutoCompleteComboBox.js";
import Carousel from "../../src/plain/PlainCarousel.js";

class CarouselComboBox extends AutoCompleteComboBox {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      listPartType: Carousel,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      templateFrom.html`
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
