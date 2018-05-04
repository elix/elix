const timerTimeoutSymbol = Symbol('timerTimeout');


/**
 * Mixin which provides for automatic timed changes in selection.
 */
export default function TimerSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class TimerSelection extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      startTimerIfPlaying(this);
    }
    
    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      startTimerIfPlaying(this);
    }

    // contentChanged() {
    //   if (super.contentChanged) { super.contentChanged(); }
    //   restartTimer(this);
    // }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        playing: false,
        selectionTimerDuration: 1000
      });
    }

    /**
     * Begin automatic progression of the selection.
     */
    play() {
      this.setState({
        playing: true
      });
      this.selectNext();
    }

    /**
     * Pause automatic progression of the selection.
     */
    pause() {
      clearTimer(this);
      this.setState({
        playing: false
      });
    }

    /**
     * True if the selection is being automatically advanced.
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

    /*
     * When the selected item changes (because of something this mixin did, or
     * was changed by an outside agent like the user), we wait before advancing
     * to the next item. By triggering the next item this way, we implicitly get
     * a desirable behavior: if the user changes the selection (e.g., in a
     * carousel), we let them see that selection state for a while before
     * advancing the selection ourselves.
     */
    // get selectedItem() {
    //   return super.selectedItem;
    // }
    // set selectedItem(item) {
    //   if ('selectedItem' in base.prototype) { super.selectedItem = item; }
    //   restartTimer(this);
    // }

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
      this.setState({
        selectionTimerDuration: parseInt(selectionTimerDuration)
      });
    }

  }

  return TimerSelection;
}


function clearTimer(element) {
  if (element[timerTimeoutSymbol]) {
    clearTimeout(element[timerTimeoutSymbol]);
    element[timerTimeoutSymbol] = null;
  }
}

// function restartTimer(element) {
//   clearTimer(element);
//   if (element.playing && element.items && element.items.length > 0) {
//     startTimer(element);
//   }
// }

function startTimer(element) {
  // If play() is called more than once, cancel any existing timer.
  clearTimer(element);
  element[timerTimeoutSymbol] = setTimeout(() => {
    element[timerTimeoutSymbol] = null;
    element.selectNext();
  }, element.selectionTimerDuration);
}

function startTimerIfPlaying(element) {
  if (element.playing && !element[timerTimeoutSymbol]) {
    startTimer(element);
  } else if (!element.playing && element[timerTimeoutSymbol]) {
    clearTimer(element);
  }
}