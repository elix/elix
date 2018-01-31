import './CustomArrowButton.js';
import './CustomPageDot.js';
import { merge } from '../../src/updates.js';
import SlidingCarousel from '../../src/SlidingCarousel.js';


class CustomCarousel extends SlidingCarousel {

  get tags() {
    return merge(super.tags, {
      arrowButton: 'custom-arrow-button',
      pageDot: 'custom-page-dot'
    });
  }

  get updates() {
    return merge(super.updates, {
      $: {
        arrowButtonLeft: {
          textContent: "↫"
        },
        arrowButtonRight: {
          textContent: "↬"
        }
      }
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
