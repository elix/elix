import * as internal from '../../src/internal.js';
import * as template from '../../src/template.js';
import AutoCompleteComboBox from '../../src/AutoCompleteComboBox.js';
import Carousel from '../../src/Carousel.js';

class CarouselComboBox extends AutoCompleteComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      listRole: Carousel
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
customElements.define('carousel-combo-box', CarouselComboBox);
