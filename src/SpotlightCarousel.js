import '../demos/src/Thumbnail.js';
import '../demos/src/ThumbnailList1.js';
import './SlidingViewport.js';
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
      orientation: 'horizontal'
    });
  }

  get [symbols.swipeTarget]() {
    return this.$.stage;
  }

  get tags() {
    const base = super.tags || {};
    return Object.assign({}, base, {
      avatar: 'custom-thumbnail',
      stage: 'elix-sliding-viewport',
      cast: 'thumbnail-list'
    })
  }
  set tags(tags) {
    super.tags = tags;
  }

}


customElements.define('elix-spotlight-carousel', SpotlightCarousel);
export default SpotlightCarousel;
