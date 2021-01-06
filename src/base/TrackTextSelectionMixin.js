import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  firstRender,
  raiseChangeEvents,
  render,
  rendered,
  setState,
} from "./internal.js";

/**
 * Track the selection state of an inner input-like element
 *
 * This mixin is an adjunct to [WrappedStandardElement](WrappedStandardElement),
 * intended to be used with a wrapped input or textarea. The inner input or
 * textarea will have selection properties `selectionStart` and `selectionEnd`
 * that we would like to track as state members. Doing so is challenging,
 * because the browser provides no standard event for tracking a change in
 * selection.
 *
 * To compensate, this mixin listens to keyboard or mouse activity within the
 * inner element that might affect selection, then refreshes the host
 * component's selection state as appropriate.
 *
 * @module TrackTextSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function TrackTextSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class TrackTextSelection extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectionEnd: 0,
        selectionStart: 0,
      });
    }

    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }

      if (this[firstRender]) {
        // The user can manually update the selection with the keyboard or
        // mouse. We listen to keydown and mousedown events, wait for the
        // browser to perform its default action, and then refresh the selection
        // state in case it changed.
        const refreshListener = (() => {
          // HACK: If we check too quickly, the default action won't have
          // happened. We wait for an arbitrary amount of time that seems to
          // work, although this feels gross.
          const delay = 10; // milliseconds
          setTimeout(() => {
            this[raiseChangeEvents] = true;
            refreshSelectionState(this);
            this[raiseChangeEvents] = false;
          }, delay);
        }).bind(this);
        this.addEventListener("keydown", refreshListener);
        this.addEventListener("mousedown", refreshListener);
        this.addEventListener("touchend", refreshListener);
      }
    }

    [rendered](changed) {
      super[rendered](changed);

      // Setting value implies updating selection state as well.
      if (changed.value) {
        refreshSelectionState(this);
      }
    }
  }

  return TrackTextSelection;
}

// Refresh our selection state values from the inner component's current
// selection properties.
function refreshSelectionState(element) {
  const inner = element.inner;
  const { selectionEnd, selectionStart } = inner;
  element[setState]({
    selectionEnd,
    selectionStart,
  });
}
