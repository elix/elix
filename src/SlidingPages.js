import AriaListMixin from './AriaListMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusRingMixin from './FocusRingMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import SlidingViewport from './SlidingViewport.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  DirectionSelectionMixin(
  FocusRingMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    SlidingViewport
  ))))))));


/**
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. Shows a sliding effect when moving between items.
 * 
 * @inherits SlidingViewport
 * @mixes AriaListMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusRingMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 */
class SlidingPages extends Base {}


customElements.define('elix-sliding-pages', SlidingPages);
export default SlidingPages;
