import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import FocusRingMixin from '../mixins/FocusRingMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import SlidingViewport from './SlidingViewport';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SwipeDirectionMixin from '../mixins/SwipeDirectionMixin.js';
import TouchSwipeMixin from '../mixins/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../mixins/TrackpadSwipeMixin.js';


const Base =
  DirectionSelectionMixin(
  FocusRingMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  SelectionAriaMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    SlidingViewport
  ))))))));


class SlidingPages extends Base {}


customElements.define('elix-sliding-pages', SlidingPages);
export default SlidingPages;
