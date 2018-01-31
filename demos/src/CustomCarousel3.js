import './CustomArrowButton.js';
import './CustomPageDot.js';
import { merge } from '../../src/updates.js';
import SlidingCarousel from '../../src/SlidingCarousel.js';


class CustomCarousel extends SlidingCarousel {

  get customTags() {
    return merge(super.customTags, {
      arrowButtonTag: 'custom-arrow-button',
      pageDotTag: 'custom-page-dot'
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
