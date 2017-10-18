import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
// import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin.js';
// import FocusMixin from '../mixins/FocusMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import SlidingViewport from './SlidingViewport';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SwipeDirectionMixin from '../mixins/SwipeDirectionMixin.js';
import TouchSwipeMixin from '../mixins/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../mixins/TrackpadSwipeMixin.js';


const Base =
  DirectionSelectionMixin(
  // FocusMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  // LanguageDirectionMixin(
  SelectionAriaMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    SlidingViewport
  )))))));


class SlidingCarousel extends Base {

  // rootProps() {
  //   const base = super.rootProps ? super.rootProps() : {};
  //   const style = Object.assign({}, base.style, {
  //     'outline': !this.state.focusRing && 'none'
  //   });
  //   return Object.assign({}, base, { style });
  // }

}


customElements.define('elix-sliding-carousel', SlidingCarousel);
export default SlidingCarousel;
