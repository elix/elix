import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, stateEffects } from "./internal.js";

/**
 * Keeps the current item and selected item in sync.
 *
 * This can be used to connect [ItemsCursorMixin](ItemsCursorMixin) with
 * [SingleSelectAPIMixin](SingleSelectAPIMixin).
 *
 * @module CursorSelectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function CursorSelectMixin(Base) {
  // The class prototype added by the mixin.
  return class CursorSelect extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState], {
        selectedIndex: -1,
        selectedItem: null,
      });
    }

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
      // Since this step happens second, if both current item and selected item
      // are changed, the current item wins.
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
