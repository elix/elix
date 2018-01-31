import './CustomArrowButton.js';
import * as symbols from '../../src/symbols.js';
import { merge } from '../../src/updates.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import PageDotsMixin from '../../src/PageDotsMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  ArrowDirectionMixin(
  PageDotsMixin(
    SlidingPages
  ));


class CustomCarousel extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      arrowButtonTag: 'custom-arrow-button'
    });
  }

  get [symbols.template]() {
    return this[ArrowDirectionMixin.inject](
      this[PageDotsMixin.inject](
        super[symbols.template]
      )
    );
  }

  get updates() {
    const arrowButtonStyle = {
      'font-size': '28px',
      'font-weight': 'bold',
      padding: '0.5em'
    };
    return merge(super.updates, {
      $: {
        arrowButtonLeft: {
          style: arrowButtonStyle,
          textContent: "↫"
        },
        arrowButtonRight: {
          style: arrowButtonStyle,
          textContent: "↬"
        }
      }
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
