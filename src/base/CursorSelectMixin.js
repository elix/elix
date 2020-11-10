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
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectedIndex: -1,
        selectedItem: null,
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      if (changed.currentIndex) {
        // Priority one: selected index tracks current index.
        Object.assign(effects, {
          selectedIndex: state.currentIndex,
        });
      } else if (changed.selectedIndex) {
        // Priority two: current index tracks selected index.
        // These priorities ensure that, both current index and selected index
        // are changed, current index wins.
        Object.assign(effects, {
          currentIndex: state.selectedIndex,
        });
      }

      // Same priorities as above.
      if (changed.currentItem) {
        Object.assign(effects, {
          selectedItem: state.currentItem,
        });
      } else if (changed.selectedItem) {
        Object.assign(effects, {
          currentItem: state.selectedItem,
        });
      }

      return effects;
    }
  };
}
