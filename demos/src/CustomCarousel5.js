import './CustomArrowButton.js';
import './CustomPageDot.js';
import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import PageDotsMixin from '../../src/PageDotsMixin.js';
import PageNumbersMixin from './PageNumbersMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  ArrowDirectionMixin(
  PageDotsMixin(
  PageNumbersMixin(
    SlidingPages
  )));


// Customize everything.
class CustomCarousel extends Base {

  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    return Object.assign({}, super.defaultState, {
      showArrowButtons: window.matchMedia('(pointer:fine)').matches
    });
  }

  get tags() {
    return Object.assign({}, super.tags, {
      arrowButton: 'custom-arrow-button',
      pageDot: 'custom-page-dot'
    });
  }

  get [symbols.template]() {
    return this[ArrowDirectionMixin.inject](
      this[PageDotsMixin.inject](
        this[PageNumbersMixin.inject](
          super[symbols.template]
        )
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
