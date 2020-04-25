import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Track the selection state of an inner input-like element
 *
 * This mixin is an adjunct to [WrappedStandardElement](WrappedStandardElement),
 * intended to be used with a wrapped input or textarea. The inner input or
 * textarea will have selection properties `selectionStart` and `selectionEnd`
 * that we would like to track as state members. Doing so is challenging,
 * because the browser provides no standard event tracking a change in
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
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        selectionEnd: null,
        selectionStart: null,
      });
    }

    [internal.render](changed) {
      super[internal.render](changed);

      if (this[internal.firstRender]) {
        // The user can manually update the selection with the keyboard or
        // mouse. We listen to keydown and mousedown events, wait for the
        // browser to perform its default action, and then check refresh our
        // selection state in case it changed.
        const refreshListener = (() => {
          // HACK:  If we check too quickly, the default action won't have
          // happened. We wait for an arbitrary amount of time that seems to
          // work, but that feels gross.
          const delay = 10; // milliseconds
          setTimeout(() => {
            this[internal.raiseChangeEvents] = true;
            refreshSelectionState(this);
            this[internal.raiseChangeEvents] = false;
          }, delay);
        }).bind(this);
        this.addEventListener("keydown", refreshListener);
        this.addEventListener("mousedown", refreshListener);
      }
    }

    [internal.rendered](changed) {
      super[internal.rendered](changed);

      // If either selection property is null, pick up its rendered value now.
      const { selectionEnd, selectionStart } = this[internal.state];
      if (selectionEnd === null) {
        this[internal.setState]({
          selectionEnd: this.inner.selectionEnd,
        });
      }
      if (selectionStart === null) {
        this[internal.setState]({
          selectionStart: this.inner.selectionStart,
        });
      }
    }

    [internal.stateEffects](state, changed) {
      const effects = super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};

      // Setting the value will implicitly update the selection. Clear out the
      // selection state so it'll be refreshed after we render.
      if (changed.value) {
        Object.assign(effects, {
          selectionStart: null,
          selectionEnd: null,
        });
      }

      return effects;
    }
  }

  return TrackTextSelection;
}

// Refresh our selection state values from the inner component's current
// selection properties.
function refreshSelectionState(element) {
  const inner = element.inner;
  const { selectionEnd, selectionStart } = inner;
  element[internal.setState]({
    selectionEnd,
    selectionStart,
  });
}
