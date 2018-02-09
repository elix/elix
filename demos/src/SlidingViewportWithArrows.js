import * as symbols from '../../src/symbols.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import DirectionSelectionMixin from '../../src/DirectionSelectionMixin.js';
import SlidingViewport from '../../src/SlidingViewport.js';


const Base =
  ArrowDirectionMixin(
  DirectionSelectionMixin(
    SlidingViewport
  ));


class SlidingViewportWithArrows extends Base {

  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    return Object.assign({}, super.defaultState, {
      showArrowButtons: window.matchMedia('(pointer:fine)').matches
    });
  }

  get [symbols.template]() {
    return this[ArrowDirectionMixin.inject](
      super[symbols.template]
    );
  }

}



customElements.define('sliding-viewport-with-arrows', SlidingViewportWithArrows);
export default SlidingViewportWithArrows;
