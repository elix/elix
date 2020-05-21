import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { stateEffects } from "./internal.js";

/**
 * Keeps the current item and selected item in sync.
 *
 * This can be used to connect [ItemsCursorMixin](ItemsCursorMixin) with
 * [SingleSelectAPIMixin](SingleSelectAPIMixin).
 *
 * @module SelectCurrentMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SelectCurrentMixin(Base) {
  // The class prototype added by the mixin.
  return class SelectCurrent extends Base {
    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Selection tracks current item.
      if (changed.currentIndex) {
        Object.assign(effects, {
          selectedIndex: state.currentIndex,
        });
      }
      if (changed.currentItem) {
        Object.assign(effects, {
          selectedItem: state.currentItem,
        });
      }

      // Current item tracks selection.
      if (changed.selectedIndex) {
        Object.assign(effects, {
          currentIndex: state.selectedIndex,
        });
      }
      if (changed.selectedItem) {
        Object.assign(effects, {
          currentItem: state.selectedItem,
        });
      }

      return effects;
    }
  };
}
