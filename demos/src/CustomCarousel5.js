import './CustomArrowButton.js';
import './CustomPageDot.js';
import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import PageNumbersMixin from '../../src/PageNumbersMixin.js';
import Carousel from '../../src/Carousel.js';


const Base =
  PageNumbersMixin(
    Carousel
  );


// Customize everything.
class CustomCarousel extends Base {

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        arrowButton: 'custom-arrow-button',
        proxy: 'custom-page-dot'
      })
    });
  }

  get [symbols.template]() {
    return this[PageNumbersMixin.inject](super[symbols.template]);
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
