/**
 * Automatically updates selection on a timer.
 * 
 * [SlideshowWithPlayControls uses TimerSelectionMixin for its timer](/demos/slideshowWithPlayControls.html)
 * 
 * If the user changes the selection, or the selection changes for any other reason,
 * the timer resets. This ensures the user has a chance to look at the item they want
 * before the timer advances the selection.
 * 
 * @module TimerSelectionMixin
 */
export default function TimerSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class TimerSelection extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      updateTimer(this);
    }
    
    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      updateTimer(this);
    }

    get defaultState() {
      return Object.assign(super.defaultState, {
        playing: true,
        selectedIndexForTimer: null,
        selectionTimerDuration: 1000,
        timerTimeout: null
      });
    }

    /**
     * Begin automatic progression of the selection.
     */
    play() {
      if (!this.playing) {
        this.selectNext();
        this.setState({
          playing: true
        });
      }
    }

    /**
     * Pause automatic progression of the selection.
     */
    pause() {
      this.setState({
        playing: false
      });
    }

    /**
     * True if the element is playing.
     *
     * @type {boolean}
     * @default false
     */
    get playing() {
      return this.state.playing;
    }
    set playing(playing) {
      const parsed = String(playing) === 'true';
      if (parsed !== this.state.playing) {
        if (parsed) {
          this.play();
        } else {
          this.pause();
        }
      }
    }

    /**
     * The time in milliseconds that will elapse after the selection changes
     * before the selection will be advanced to the next item in the list.
     *
     * @type {number} - Time in milliseconds
     * @default 1000 (1 second)
     */
    get selectionTimerDuration() {
      return this.state.selectionTimerDuration;
    }
    set selectionTimerDuration(selectionTimerDuration) {
      const parsed = Number(selectionTimerDuration);
      if (!isNaN(parsed)) {
        this.setState({
          selectionTimerDuration: parsed
        });
      }
    }

  }

  return TimerSelection;
}


function clearTimer(element) {
  if (element.state.timerTimeout) {
    clearTimeout(element.state.timerTimeout);
    element.setState({
      timerTimeout: null
    });
  }
}

function restartTimer(element) {
  if (element.state.timerTimeout) {
    clearTimeout(element.state.timerTimeout);
  }
  if (element.items && element.items.length > 0) {

    // When the timer times out, all we need to do is move to the next slide.
    // When the component updates, the updateTimer function will notice the
    // change in selection, and invoke restartTimer again to start a new timer
    // for the next slide.
    const timerTimeout = setTimeout(() => {
      element.selectNext();
    }, element.selectionTimerDuration);

    // Set the timer as state, also noting which slide we're currently on.
    element.setState({
      selectedIndexForTimer: element.state.selectedIndex,
      timerTimeout
    });
  }
}

// Update the timer to match the element's `playing` state.
function updateTimer(element) {
  // If the element is playing and we haven't started a timer yet, do so now.
  // Also, if the element's selectedIndex changed for any reason, restart the
  // timer. This ensures that the timer restarts no matter why the selection
  // changes: it could have been us moving to the next slide because the timer
  // elapsed, or the user might have directly manipulated the selection, etc.
  if (element.state.playing &&
      (!element.state.timerTimeout || element.state.selectedIndex !== element.state.selectedIndexForTimer)) {
    restartTimer(element);
  } else if (!element.state.playing && element.state.timerTimeout) {
    clearTimer(element);
  }
}
