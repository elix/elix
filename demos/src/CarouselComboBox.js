import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import AutoCompleteComboBox from "../../src/base/AutoCompleteComboBox.js";
import Carousel from "../../src/base/Carousel.js";

class CarouselComboBox extends AutoCompleteComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      listPartType: Carousel
    });
  }

  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
      <style>
        #list {
          background: black;
        }
      </style>
    `
    );
  }
}

export default CarouselComboBox;
customElements.define("carousel-combo-box", CarouselComboBox);
