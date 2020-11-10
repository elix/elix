import * as internal from "../base/internal.js";
import TooltipButton from "../base/TooltipButton.js";
import PlainPopup from "./PlainPopup.js";

class PlainTooltipButton extends TooltipButton {
  // @ts-ignore
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupPartType: PlainPopup,
    });
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects]
      ? super[internal.stateEffects](state, changed)
      : {};

    // Open on hover, close when hover stops.
    if (changed.hover) {
      Object.assign(effects, {
        opened: state.hover,
      });
    }

    return effects;
  }
}

export default PlainTooltipButton;
