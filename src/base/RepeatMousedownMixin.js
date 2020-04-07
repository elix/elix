import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

// Used to distinguish our synthetic events from a real one.
class SyntheticMouseEvent extends MouseEvent {}

/**
 * Generates mousedown events at intervals for as long as the mouse is down
 *
 * This is useful for buttons or other elements that should perform an
 * action repeatedly if the user holds down the mouse.
 *
 * @module RepeatMousedownMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function RepeatMousedownMixin(Base) {
  return class RepeatMousedown extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        repeatDelayDuration: 500, // In ms. Wait a bit before starting repeats.
        repeatInterval: null,
        repeatIntervalDuration: 50, // In ms. Once repeats start, they go fast.
        repeatTimeout: null
      });
    }

    [internal.render](changed) {
      super[internal.render](changed);

      // Wire up event handlers.
      if (this[internal.firstRender]) {
        // Only listen to mouse events with the primary (usually left) button.
        this.addEventListener("mousedown", event => {
          if (!(event instanceof SyntheticMouseEvent) && event.button === 0) {
            this[internal.raiseChangeEvents] = true;
            repeatStart(this);
            this[internal.raiseChangeEvents] = false;
          }
        });
        this.addEventListener("mouseup", event => {
          if (event.button === 0) {
            this[internal.raiseChangeEvents] = true;
            repeatStop(this);
            this[internal.raiseChangeEvents] = false;
          }
        });
        this.addEventListener("mouseleave", event => {
          if (event.button === 0) {
            this[internal.raiseChangeEvents] = true;
            repeatStop(this);
            this[internal.raiseChangeEvents] = false;
          }
        });

        // Treat touch events like mouse events.
        this.addEventListener("touchstart", () => {
          this[internal.raiseChangeEvents] = true;
          repeatStart(this);
          this[internal.raiseChangeEvents] = false;
        });
        this.addEventListener("touchend", () => {
          this[internal.raiseChangeEvents] = true;
          repeatStop(this);
          this[internal.raiseChangeEvents] = false;
        });
      }
    }

    [internal.stateEffects](state, changed) {
      const effects = super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};

      // TODO: Avoid needing to inspect innerProperties to handle the
      // application of this mixin on a WrappedStandardElement.
      if (changed.disabled || changed.innerProperties) {
        const disabled =
          state.disabled ||
          (state.innerProperties && state.innerProperties.disabled);
        if (disabled) {
          clearRepeat(this);
          Object.assign(effects, {
            repeatInterval: null,
            repeatTimeout: null
          });
        }
      }

      return effects;
    }
  };
}

function clearRepeat(element) {
  if (element[internal.state].repeatTimeout) {
    clearTimeout(element[internal.state].repeatTimeout);
  }
  if (element[internal.state].repeatInterval) {
    clearInterval(element[internal.state].repeatInterval);
  }
}

function repeatStart(element) {
  // Start initial wait.
  const { repeatIntervalDuration, repeatDelayDuration } = element[
    internal.state
  ];
  const repeatTimeout = setTimeout(() => {
    // Initial wait complete; start repeat interval.
    const repeatInterval = setInterval(() => {
      // Repeat interval passed; raise a mousedown event.
      raiseMousedown(element);
    }, repeatIntervalDuration);
    element[internal.setState]({ repeatInterval });
  }, repeatDelayDuration - repeatIntervalDuration);
  element[internal.setState]({ repeatTimeout });
}

// Stop timeout and/or interval in progress.
function repeatStop(element) {
  clearRepeat(element);
  element[internal.setState]({
    repeatTimeout: null,
    repeatInterval: null
  });
}

// Raise a synthetic mousedown event.
function raiseMousedown(element) {
  const event = new SyntheticMouseEvent("mousedown", {
    bubbles: true,
    button: 0,
    cancelable: true,
    clientX: 0,
    clientY: 0
  });
  element.dispatchEvent(event);
}
