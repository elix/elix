import { getSuperProperty } from '../../src/workarounds.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import AutoCompleteComboBox from '../../src/AutoCompleteComboBox.js';
import Carousel from '../../src/Carousel.js';


class CarouselComboBox extends AutoCompleteComboBox {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listRole: Carousel
    });
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        #list {
          background: black;
        }
      </style>
    `);
  }

}


export default CarouselComboBox;
customElements.define('carousel-combo-box', CarouselComboBox);
