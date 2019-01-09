import { getSuperProperty } from '../../src/workarounds.js';
import { html } from '../../src/template.js';
import * as symbols from '../../src/symbols.js';
import AutoCompleteComboBox from '../../src/AutoCompleteComboBox.js';
import Carousel from '../../src/Carousel.js';


class CarouselComboBox extends AutoCompleteComboBox {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listRole: Carousel
    });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CarouselComboBox, symbols.template);
    const styleTemplate = html`
      <style>
        #list {
          background: black;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
  }

}


export default CarouselComboBox;
customElements.define('carousel-combo-box', CarouselComboBox);
