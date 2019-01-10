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
    // Next line is same as: const base = super[symbols.template]
    const base = getSuperProperty(this, CarouselComboBox, symbols.template);
    return template.concat(base, template.html`
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
