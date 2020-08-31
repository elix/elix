import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  firstRender,
  raiseChangeEvents,
  render,
  setState,
  state,
  stateEffects,
} from "./internal.js";

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
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        repeatDelayDuration: 500, // In ms. Wait a bit before starting repeats.
        repeatInterval: null,
        repeatIntervalDuration: 50, // In ms. Once repeats start, they go fast.
        repeatTimeout: null,
      });
    }

    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }

      // Wire up event handlers.
      if (this[firstRender]) {
        // Only listen to mouse events with the primary (usually left) button.
        this.addEventListener("mousedown", (event) => {
          if (!(event instanceof SyntheticMouseEvent) && event.button === 0) {
            this[raiseChangeEvents] = true;
            repeatStart(this);
            this[raiseChangeEvents] = false;
          }
        });
        this.addEventListener("mouseup", (event) => {
          if (event.button === 0) {
            this[raiseChangeEvents] = true;
            repeatStop(this);
            this[raiseChangeEvents] = false;
          }
        });
        this.addEventListener("mouseleave", (event) => {
          if (event.button === 0) {
            this[raiseChangeEvents] = true;
            repeatStop(this);
            this[raiseChangeEvents] = false;
          }
        });

        // Treat touch events like mouse events.
        this.addEventListener("touchstart", () => {
          this[raiseChangeEvents] = true;
          repeatStart(this);
          this[raiseChangeEvents] = false;
        });
        this.addEventListener("touchend", () => {
          this[raiseChangeEvents] = true;
          repeatStop(this);
          this[raiseChangeEvents] = false;
        });
      }
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      if (changed.disabled) {
        if (state.disabled) {
          clearRepeat(this);
          Object.assign(effects, {
            repeatInterval: null,
            repeatTimeout: null,
          });
        }
      }

      return effects;
    }
  };
}

function clearRepeat(element) {
  if (element[state].repeatTimeout) {
    clearTimeout(element[state].repeatTimeout);
  }
  if (element[state].repeatInterval) {
    clearInterval(element[state].repeatInterval);
  }
}

function repeatStart(element) {
  // Start initial wait.
  const { repeatIntervalDuration, repeatDelayDuration } = element[state];
  const repeatTimeout = setTimeout(() => {
    // Initial wait complete; start repeat interval.
    const repeatInterval = setInterval(() => {
      // Repeat interval passed; raise a mousedown event.
      raiseMousedown(element);
    }, repeatIntervalDuration);
    element[setState]({ repeatInterval });
  }, repeatDelayDuration - repeatIntervalDuration);
  element[setState]({ repeatTimeout });
}

// Stop timeout and/or interval in progress.
function repeatStop(element) {
  clearRepeat(element);
  element[setState]({
    repeatTimeout: null,
    repeatInterval: null,
  });
}

// Raise a synthetic mousedown event.
function raiseMousedown(element) {
  const event = new SyntheticMouseEvent("mousedown", {
    bubbles: true,
    button: 0,
    cancelable: true,
    clientX: 0,
    clientY: 0,
  });
  element.dispatchEvent(event);
}
