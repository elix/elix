import './CustomArrowButton.js';
import { merge } from '../../src/updates.js';
import SlidingCarousel from '../../src/SlidingCarousel.js';


class CustomCarousel extends SlidingCarousel {

  get elementTags() {
    return merge(super.elementTags, {
      arrowButtonTag: 'custom-arrow-button'
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
