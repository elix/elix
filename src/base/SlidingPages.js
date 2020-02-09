import * as internal from "./internal.js";
import AriaListMixin from "./AriaListMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import SlidingStage from "./SlidingStage.js";
import SwipeDirectionMixin from "./SwipeDirectionMixin.js";
import TouchSwipeMixin from "./TouchSwipeMixin.js";
import TrackpadSwipeMixin from "./TrackpadSwipeMixin.js";

const Base = AriaListMixin(
  DirectionSelectionMixin(
    FocusVisibleMixin(
      KeyboardDirectionMixin(
        KeyboardMixin(
          SwipeDirectionMixin(TouchSwipeMixin(TrackpadSwipeMixin(SlidingStage)))
        )
      )
    )
  )
);

/**
 * Simple carousel with no visible UI controls
 *
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. Shows a sliding effect when moving between items.
 *
 * @inherits SlidingStage
 * @mixes AriaListMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 */
class SlidingPages extends Base {
  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // Have swipeAxis follow orientation.
    if (changed.orientation) {
      Object.assign(effects, {
        swipeAxis: state.orientation
      });
    }

    return effects;
  }
}

export default SlidingPages;
