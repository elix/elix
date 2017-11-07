import * as props from './props.js';
import Symbol from './Symbol.js';


const deltaXSymbol = Symbol('deltaX');
const deltaYSymbol = Symbol('deltaY');
const multiTouchSymbol = Symbol('multiTouch');
const previousXSymbol = Symbol('previousX');
const previousYSymbol = Symbol('previousY');
const startXSymbol = Symbol('startX');


export default function TouchSwipeMixin(Base) {
  return class TouchSwipe extends Base {

    constructor() {
      super();

      // In all touch events, only handle single touches. We don't want to
      // inadvertently do work when the user's trying to pinch-zoom for example.
      // TODO: Even better approach than below would be to ignore touches after
      // the first if the user has already begun a swipe.
      // TODO: Touch events should probably be factored out into its own mixin.
      if (window.PointerEvent) {
        // Prefer listening to standard pointer events.
        this.addEventListener('pointerdown', event => {
          if (isEventForPenOrPrimaryTouch(event)) {
            gestureStart(this, event.clientX, event.clientY);
          }
        });
        this.addEventListener('pointermove', event => {
          if (isEventForPenOrPrimaryTouch(event)) {
            const handled = gestureContinue(this, event.clientX, event.clientY);
            if (handled) {
              event.preventDefault();
            }
          }
        });
        this.addEventListener('pointerup', event => {
          if (isEventForPenOrPrimaryTouch(event)) {
            gestureEnd(this, event.clientX, event.clientY);
          }
        });
      } else {
        // Pointer events not supported -- listen to older touch events.
        this.addEventListener('touchstart', event => {
          if (this[multiTouchSymbol]) {
            return;
          } else if (event.touches.length === 1) {
            const clientX = event.changedTouches[0].clientX;
            const clientY = event.changedTouches[0].clientY;
            gestureStart(this, clientX, clientY);
          } else {
            this[multiTouchSymbol] = true;
          }
        });
        this.addEventListener('touchmove', event => {
          if (!this[multiTouchSymbol] && event.touches.length === 1) {
            const clientX = event.changedTouches[0].clientX;
            const clientY = event.changedTouches[0].clientY;
            const handled = gestureContinue(this, clientX, clientY);
            if (handled) {
              event.preventDefault();
            }
          }
        });
        this.addEventListener('touchend', event => {
          if (event.touches.length === 0) {
            // All touches removed; gesture is complete.
            if (!this[multiTouchSymbol]) {
              // Single-touch swipe has finished.
              const clientX = event.changedTouches[0].clientX;
              const clientY = event.changedTouches[0].clientY;
              gestureEnd(this, clientX, clientY);
            }
            this[multiTouchSymbol] = false;
          }
        });
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        swipeFraction: null,
        touchAction: 'none'
      });
    }

    get props() {
      return props.merge(super.props, {
        style: {
          'touch-action': this.state.touchAction
        }
      })
    }

    get swipeTarget() {
      return super.swipeTarget || this;
    }

    updateSwipeFraction(swipeFraction) {
      // TODO: Rationalize or clean this out.
      // const changed = this.state.swipeFraction !== swipeFraction;
      // if (changed) {
      //   if (this.props.onSwipeFractionChanged) {
      //     this.props.onSwipeFractionChanged(swipeFraction);
      //   } else {
          this.setState({ swipeFraction });
      //   }
      // }
      // return changed;
    }

  }
}


// Return true if the pointer event is for the pen, or the primary touch point.
function isEventForPenOrPrimaryTouch(event) {
  return event.pointerType === 'pen' ||
    (event.pointerType === 'touch' && event.isPrimary);
}

/*
 * Invoked when the user has moved during a touch operation.
 */
function gestureContinue(element, clientX, clientY) {
  element[deltaXSymbol] = clientX - element[previousXSymbol];
  element[deltaYSymbol] = clientY - element[previousYSymbol];
  element[previousXSymbol] = clientX;
  element[previousYSymbol] = clientY;
  if (Math.abs(element[deltaXSymbol]) > Math.abs(element[deltaYSymbol])) {
    // Move was mostly horizontal.
    const swipeFraction = getSwipeFraction(element, clientX);
    element.updateSwipeFraction(swipeFraction);
    // Indicate that the event was handled. It'd be nicer if we didn't have
    // to do this so that, e.g., a user could be swiping left and right
    // while simultaneously scrolling up and down. (Native touch apps can do
    // that.) However, Mobile Safari wants to handle swipe events near the
    // page and interpret them as navigations. To avoid having a horiziontal
    // swipe misintepreted as a navigation, we indicate that we've handled
    // the event, and prevent default behavior.
    return true;
  } else {
    // Move was mostly vertical.
    return false; // Not handled
  }
}

/*
 * Invoked when the user has finished a touch operation.
 */
/* eslint-disable no-unused-vars */
function gestureEnd(component, clientX, clientY) {

  let gesture;
  // TODO: Make flick gesture use timing instead of just distance so that it
  // works better on Android.
  if (component[deltaXSymbol] >= 20) {
    // Finished going right at high speed.
    gesture = 'swipeRight';
  } else if (component[deltaXSymbol] <= -20) {
    // Finished going left at high speed.
    gesture = 'swipeLeft';
  } else {
    // Finished at low speed.
    const swipeFraction = getSwipeFraction(component, clientX);
    if (swipeFraction >= 0.5) {
      gesture = 'swipeLeft';
    } else if (swipeFraction <= -0.5) {
      gesture = 'swipeRight';
    }
  }

  component[deltaXSymbol] = null;
  component[deltaYSymbol] = null;

  // If component has method for indicated gesture, invoke it.
  if (gesture && component[gesture]) {
    component[gesture]();
  }

  component.updateSwipeFraction(null);
}

/*
 * Invoked when the user has begun a touch operation.
 */
function gestureStart(element, clientX, clientY) {
  element[startXSymbol] = clientX;
  element[previousXSymbol] = clientX;
  element[previousYSymbol] = clientY;
  element[deltaXSymbol] = 0;
  element[deltaYSymbol] = 0;
  element.updateSwipeFraction(0);
}

function getSwipeFraction(element, x) {
  const width = element.swipeTarget.offsetWidth;
  const dragDistance = element[startXSymbol] - x;
  const fraction = width > 0 ?
    dragDistance / width :
    0;
  return fraction;
}
