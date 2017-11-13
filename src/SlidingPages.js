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


class SlidingPages extends Base {}


customElements.define('elix-sliding-pages', SlidingPages);
export default SlidingPages;
