import {
  defaultState,
  firstRender,
  ids,
  render,
  template,
} from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import AutoCompleteComboBox from "../../src/plain/PlainAutoCompleteComboBox.js";
import Carousel from "../../src/plain/PlainCarousel.js";

class CarouselComboBox extends AutoCompleteComboBox {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      listPartType: Carousel,
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      // We want to keep the combo box open even if the user is clicking in the
      // popup. For that reason, we prevent mouseup events on the arrow buttons
      // or proxies from bubbling up to the combo box.
      this[ids].list.addEventListener("mouseup", (event) => {
        event.stopImmediatePropagation();
      });
    }
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
