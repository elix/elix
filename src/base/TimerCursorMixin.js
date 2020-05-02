import { booleanAttributeValue } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Automatically advances an item cursor on a timer
 *
 * [SlideshowWithPlayControls uses TimerCursorMixin for its timer](/demos/slideshowWithPlayControls.html)
 *
 * If the user moves the cursor, or the cursor moves for any other reason, the
 * timer resets. This ensures the user has a chance to look at the item they
 * want before the timer advances the cursor.
 *
 * @module TimerCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function TimerCursorMixin(Base) {
  // The class prototype added by the mixin.
  class TimerCursor extends Base {
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "cursor-timer-duration") {
        this.cursorTimerDuration = Number(newValue);
      } else if (name === "playing") {
        const value = booleanAttributeValue(name, newValue);
        if (this.playing !== value) {
          this.playing = value;
        }
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    /**
     * The time in milliseconds that will elapse after the cursor advances
     * before the cursor will be advanced to the next item in the list.
     *
     * @type {number} - Time in milliseconds
     * @default 1000 (1 second)
     */
    get cursorTimerDuration() {
      return this[internal.state].cursorTimerDuration;
    }
    set cursorTimerDuration(cursorTimerDuration) {
      if (!isNaN(cursorTimerDuration)) {
        this[internal.setState]({ cursorTimerDuration });
      }
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        currentIndexForTimer: null,
        cursorTimerDuration: 1000,
        playing: true,
        timerTimeout: null,
      });
    }

    /**
     * Begin automatic progression of the cursor.
     */
    play() {
      if (!this.playing) {
        this[internal.goNext]();
        this[internal.setState]({
          playing: true,
        });
      }
    }

    /**
     * Pause automatic progression of the cursor.
     */
    pause() {
      this[internal.setState]({
        playing: false,
      });
    }

    /**
     * True if the element is playing.
     *
     * @type {boolean}
     * @default false
     */
    get playing() {
      return this[internal.state].playing;
    }
    set playing(playing) {
      if (playing !== this[internal.state].playing) {
        if (playing) {
          this.play();
        } else {
          this.pause();
        }
      }
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }

      updateTimer(this);
    }
  }

  return TimerCursor;
}

function clearTimer(/** @type {ReactiveElement} */ element) {
  if (element[internal.state].timerTimeout) {
    clearTimeout(element[internal.state].timerTimeout);
    element[internal.setState]({
      timerTimeout: null,
    });
  }
}

function restartTimer(/** @type {ReactiveElement} */ element) {
  if (element[internal.state].timerTimeout) {
    clearTimeout(element[internal.state].timerTimeout);
  }
  if (element.items && element.items.length > 0) {
    // When the timer times out, all we need to do is move to the next slide.
    // When the component updates, the updateTimer function will notice the
    // cursor has moved, and invoke restartTimer again to start a new timer
    // for the next slide.
    const timerTimeout = setTimeout(() => {
      element[internal.goNext]();
    }, element.cursorTimerDuration);

    // Set the timer as state, also noting which slide we're currently on.
    element[internal.setState]({
      currentIndexForTimer: element[internal.state].currentIndex,
      timerTimeout,
    });
  }
}

// Update the timer to match the element's `playing` state.
function updateTimer(/** @type {ReactiveElement} */ element) {
  // If the element is playing and we haven't started a timer yet, do so now.
  // Also, if the element's currentIndex changed for any reason, restart the
  // timer. This ensures that the timer restarts no matter why the cursor moves:
  // it could have been us moving to the next slide because the timer elapsed,
  // or the user might have directly moved the cursor, etc.
  if (
    element[internal.state].playing &&
    (!element[internal.state].timerTimeout ||
      element[internal.state].currentIndex !==
        element[internal.state].currentIndexForTimer)
  ) {
    restartTimer(element);
  } else if (
    !element[internal.state].playing &&
    element[internal.state].timerTimeout
  ) {
    clearTimer(element);
  }
}
