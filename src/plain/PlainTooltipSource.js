import * as internal from "../base/internal.js";
import PlainPopup from "./PlainPopup.js";
import TooltipSource from "../base/ToolTipSource.js";

class PlainTooltipSource extends TooltipSource {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupPartType: PlainPopup
    });
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects]
      ? super[internal.stateEffects](state, changed)
      : {};

    // Open on hover, close when hover stops.
    if (changed.hover) {
      Object.assign(effects, {
        opened: state.hover
      });
    }

    return effects;
  }
}

export default PlainTooltipSource;
