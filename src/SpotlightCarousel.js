import './Thumbnail.js';
// import './CenteredStripHighlight.js';
import './CenteredStripOpacity.js';
import '../demos/src/SlidingViewportWithArrows.js';
import './SlidingViewport.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import Spotlight from './Spotlight.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    Spotlight
  ))))))));


/**
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. Shows a sliding effect when moving between items.
 * 
 * @inherits SlidingViewport
 * @mixes AriaListMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 */
class SpotlightCarousel extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      castPosition: 'bottom',
      orientation: 'horizontal'
    });
  }

  get defaultTags() {
    const base = super.defaultTags || {};
    return Object.assign({}, base, {
      avatar: 'custom-thumbnail',
      // cast: 'centered-strip-highlight',
      cast: 'centered-strip-opacity',
      // stage: 'elix-sliding-viewport'
      stage: 'sliding-viewport-with-arrows'
    })
  }

  get [symbols.swipeTarget]() {
    /** @type {any} */
    const element = this.$.stage;
    return element;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        stage: {
          attributes: {
            tabindex: ''
          }
        },
        // cast: {
        //   style: {
        //     flex: '0.2'
        //   }
        // }
      }
    });
  }

}


customElements.define('elix-spotlight-carousel', SpotlightCarousel);
export default SpotlightCarousel;
