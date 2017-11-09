import * as props from '../utilities/props.js';
import Symbol from '../utilities/Symbol.js';


const multiTouchKey = Symbol('multiTouch');
const previousTimeKey = Symbol('previousTime');
const previousVelocityKey = Symbol('previousVelocity');
const previousXKey = Symbol('previousX');
const previousYKey = Symbol('previousY');
const startXKey = Symbol('startX');


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
          if (this[multiTouchKey]) {
            return;
          } else if (event.touches.length === 1) {
            const clientX = event.changedTouches[0].clientX;
            const clientY = event.changedTouches[0].clientY;
            gestureStart(this, clientX, clientY);
          } else {
            this[multiTouchKey] = true;
          }
        });
        this.addEventListener('touchmove', event => {
          if (!this[multiTouchKey] && event.touches.length === 1) {
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
            if (!this[multiTouchKey]) {
              // Single-touch swipe has finished.
              const clientX = event.changedTouches[0].clientX;
              const clientY = event.changedTouches[0].clientY;
              gestureEnd(this, clientX, clientY);
            }
            this[multiTouchKey] = false;
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
function gestureContinue(component, clientX, clientY) {

  // Calculate and save the velocity since the last event. If this is the last
  // movement of the gesture, this velocity will be used to determine whether
  // the user is trying to flick.
  const deltaX = clientX - component[previousXKey];
  const deltaY = clientY - component[previousYKey];
  const now = Date.now();
  const deltaTime = now - component[previousTimeKey];
  const velocity = deltaX / deltaTime * 1000;

  component[previousXKey] = clientX;
  component[previousYKey] = clientY;
  component[previousTimeKey] = now;
  component[previousVelocityKey] = velocity;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Move was mostly horizontal.
    const swipeFraction = getSwipeFraction(component, clientX);
    component.setState({ swipeFraction });
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
  // Examine velocity of last movement to see if user is flicking.
  const velocity = component[previousVelocityKey];
  const flickThresholdVelocity = 800; // speed in pixels/second
  if (velocity >= flickThresholdVelocity) {
    // Flicked right at high speed.
    gesture = 'swipeRight';
  } else if (velocity <= -flickThresholdVelocity) {
    // Flicked left at high speed.
    gesture = 'swipeLeft';
  } else {
    // Finished at low speed.
    const swipeFraction = getSwipeFraction(component, clientX);
    if (swipeFraction <= -0.5) {
      gesture = 'swipeLeft';
    } else if (swipeFraction >= 0.5) {
      gesture = 'swipeRight';
    }
  }

  // If component has method for indicated gesture, invoke it.
  if (gesture && component[gesture]) {
    component[gesture]();
  }

  component.setState({ swipeFraction: null });
}

/*
 * Invoked when the user has begun a touch operation.
 */
function gestureStart(component, clientX, clientY) {
  component[startXKey] = clientX;
  component[previousXKey] = clientX;
  component[previousYKey] = clientY;
  component[previousTimeKey] = Date.now();
  component[previousVelocityKey] = 0;
  component.setState({ swipeFraction: 0 });
}

function getSwipeFraction(component, x) {
  const dragDistance = x - component[startXKey];
  const width = component.swipeTarget.offsetWidth;
  const fraction = width > 0 ?
    dragDistance / width :
    0;
  return fraction;
}
