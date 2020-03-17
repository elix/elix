import { canScrollInDirection } from "./scrolling.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/** @type {any} */
const deferToScrollingKey = Symbol("deferToScrolling");
/** @type {any} */
const multiTouchKey = Symbol("multiTouch");
const previousTimeKey = Symbol("previousTime");
const previousVelocityKey = Symbol("previousVelocity");
const previousXKey = Symbol("previousX");
const previousYKey = Symbol("previousY");
const startXKey = Symbol("startX");
const startYKey = Symbol("startY");
const touchSequenceAxisKey = Symbol("touchSequenceAxis");

/**
 * Map touch events to swipe gestures.
 *
 * @module TouchSwipeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function TouchSwipeMixin(Base) {
  // The class prototype added by the mixin.
  return class TouchSwipe extends Base {
    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }

      if (this[internal.firstRender]) {
        // In all touch events, only handle single touches. We don't want to
        // inadvertently do work when the user's trying to pinch-zoom for
        // example. TODO: Touch events should probably be factored out into its
        // own mixin.

        // Prefer using the older touch events if supported.
        // See the rationale for this in the comments for rendered.
        if ("TouchEvent" in window) {
          this.addEventListener("touchstart", async event => {
            this[internal.raiseChangeEvents] = true;
            if (this[multiTouchKey]) {
              return;
            } else if (event.touches.length === 1) {
              const { clientX, clientY } = event.changedTouches[0];
              gestureStart(this, clientX, clientY);
            } else {
              this[multiTouchKey] = true;
            }
            await Promise.resolve();
            this[internal.raiseChangeEvents] = false;
          });

          this.addEventListener("touchmove", async event => {
            this[internal.raiseChangeEvents] = true;
            if (
              !this[multiTouchKey] &&
              event.touches.length === 1 &&
              event.target
            ) {
              const { clientX, clientY } = event.changedTouches[0];
              const handled = gestureContinue(
                this,
                clientX,
                clientY,
                event.target
              );
              if (handled) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
            await Promise.resolve();
            this[internal.raiseChangeEvents] = false;
          });

          this.addEventListener("touchend", async event => {
            this[internal.raiseChangeEvents] = true;
            if (event.touches.length === 0 && event.target) {
              // All touches removed; gesture is complete.
              if (!this[multiTouchKey]) {
                // Single-touch swipe has finished.
                const { clientX, clientY } = event.changedTouches[0];
                gestureEnd(this, clientX, clientY, event.target);
              }
              this[multiTouchKey] = false;
            }
            await Promise.resolve();
            this[internal.raiseChangeEvents] = false;
          });
        } else if ("PointerEvent" in window) {
          // Use pointer events.
          this.addEventListener("pointerdown", async event => {
            this[internal.raiseChangeEvents] = true;
            if (isEventForPenOrPrimaryTouch(event)) {
              const { clientX, clientY } = event;
              gestureStart(this, clientX, clientY);
            }
            await Promise.resolve();
            this[internal.raiseChangeEvents] = false;
          });

          this.addEventListener("pointermove", async event => {
            this[internal.raiseChangeEvents] = true;
            if (isEventForPenOrPrimaryTouch(event) && event.target) {
              const { clientX, clientY } = event;
              const handled = gestureContinue(
                this,
                clientX,
                clientY,
                event.target
              );
              if (handled) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
            await Promise.resolve();
            this[internal.raiseChangeEvents] = false;
          });

          this.addEventListener("pointerup", async event => {
            this[internal.raiseChangeEvents] = true;
            if (isEventForPenOrPrimaryTouch(event) && event.target) {
              const { clientX, clientY } = event;
              gestureEnd(this, clientX, clientY, event.target);
            }
            await Promise.resolve();
            this[internal.raiseChangeEvents] = false;
          });
        }

        //
        // Choosing a touch-action value is unfortunately fraught with issues.
        //
        // As best as we can tell, touch-action has different behavior with the
        // older TouchEvents and the newer PointerEvents.
        //
        // With TouchEvents, we can set touch-action: manipulation, and get what
        // we want in all cases. In particular, a touch-sensitive component on a
        // scrolling surface will still be able to scroll if TouchSwipeMixin
        // declines to handle a touch event. (It appears that more specific
        // touch-action values like "pan-x" would prevent touch scrolling in the
        // cross-axis, where as "manipulation" allows cross-axis scrolling.)
        //
        // With PointerEvents, it looks like we can get what we want in many
        // cases with touch-action: none, but that has the unfortunate
        // side-effect of disabling useful default interactions like scrolling
        // with touch.
        //
        // For this reason, we currently prefer using TouchEvents. Those are
        // supported In Chrome, Safari, and Firefox. (As of Oct 2018, MDN says
        // TouchEvents are not supported in Safari, but as far as we can tell,
        // they actually are.) On those browsers, we set touch-action:
        // manipulation.
        //
        // That leaves Edge, where we're forced to use PointerEvents, and the best
        // touch-action we can find is "none". That allows many use cases to
        // function properly. However, components using TouchSwipeMixin on a
        // scrolling surface in Edge won't be able to retain support for built-in
        // touch features like scrolling.
        //
        this.style.touchAction =
          "TouchEvent" in window ? "manipulation" : "none";
      }
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        swipeAxis: "horizontal",
        swipeDownWillCommit: false,
        swipeFraction: null,
        swipeFractionMax: 1,
        swipeFractionMin: -1,
        swipeLeftWillCommit: false,
        swipeRightWillCommit: false,
        swipeStartX: null,
        swipeStartY: null,
        swipeUpWillCommit: false
      });
    }

    /**
     * See [internal.swipeTarget](internal#internal.swipeTarget).
     *
     * @property internal.swipeTarget
     * @memberof TouchSwipeMixin
     * @type {HTMLElement}
     */
    get [internal.swipeTarget]() {
      const base = super[internal.swipeTarget];
      return base || this;
    }

    [internal.stateEffects](state, changed) {
      const effects = super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};

      // If the swipeFraction crosses the -0.5 or 0.5 mark, update our notion of
      // whether we'll commit an operation if the swipe were to finish at that
      // point. This definition is compatible with one defined by
      // TrackpadSwipeMixin.
      if (changed.swipeFraction) {
        const { swipeAxis, swipeFraction } = state;
        if (swipeFraction !== null) {
          if (swipeAxis === "horizontal") {
            Object.assign(effects, {
              swipeLeftWillCommit: swipeFraction <= -0.5,
              swipeRightWillCommit: swipeFraction >= 0.5
            });
          } else {
            Object.assign(effects, {
              swipeUpWillCommit: swipeFraction <= -0.5,
              swipeDownWillCommit: swipeFraction >= 0.5
            });
          }
        }
      }

      return effects;
    }
  };
}

/**
 * Return true if the pointer event is for the pen, or the primary touch point.
 *
 * @private
 * @param {PointerEvent} event
 */
function isEventForPenOrPrimaryTouch(event) {
  return (
    event.pointerType === "pen" ||
    (event.pointerType === "touch" && event.isPrimary)
  );
}

/**
 * Invoked when the user has moved during a touch operation.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} clientX
 * @param {number} clientY
 * @param {EventTarget} eventTarget
 */
function gestureContinue(element, clientX, clientY, eventTarget) {
  /** @type {any} */ const cast = element;

  // Calculate and save the velocity since the last event. If this is the last
  // movement of the gesture, this velocity will be used to determine whether
  // the user is trying to flick.
  const { swipeAxis, swipeFractionMax, swipeFractionMin } = element[
    internal.state
  ];
  const deltaX = clientX - cast[previousXKey];
  const deltaY = clientY - cast[previousYKey];
  const now = Date.now();
  const deltaTime = now - cast[previousTimeKey];
  const deltaAlongAxis = swipeAxis === "vertical" ? deltaY : deltaX;
  const velocity = (deltaAlongAxis / deltaTime) * 1000;

  cast[previousXKey] = clientX;
  cast[previousYKey] = clientY;
  cast[previousTimeKey] = now;
  cast[previousVelocityKey] = velocity;

  // Was this specific event more vertical or more horizontal?
  const eventAxis =
    Math.abs(deltaY) > Math.abs(deltaX) ? "vertical" : "horizontal";

  // Is this the first touch move event in a swipe sequence?
  const eventBeginsSequence = cast[touchSequenceAxisKey] === null;
  if (eventBeginsSequence) {
    // This first event's axis will determine which axis we'll respect for the
    // rest of the sequence.
    cast[touchSequenceAxisKey] = eventAxis;
  } else if (eventAxis !== cast[touchSequenceAxisKey]) {
    // This event continues a sequence. If the event's axis is perpendicular to
    // the sequence's axis, we'll absorb this event. E.g., if the user started a
    // vertical swipe (to scroll, say), then we absorb all subsequent horizontal
    // touch events in the sequence.
    return true;
  }

  if (eventAxis !== swipeAxis) {
    // Move wasn't along the axis we care about, ignore it.
    return false;
  }

  // Scrolling initially takes precedence over swiping.
  if (cast[deferToScrollingKey]) {
    // Predict whether the browser's default behavior for this event would cause
    // the swipe target or any of its ancestors to scroll.
    const downOrRight = deltaAlongAxis < 0;
    const willScroll = canScrollInDirection(
      eventTarget,
      swipeAxis,
      downOrRight
    );
    if (willScroll) {
      // Don't interfere with scrolling.
      return false;
    }
  }

  // Since we know we're not defering to scrolling, we can start tracking
  // the start of the swipe.
  if (!cast[startXKey]) {
    cast[startXKey] = clientX;
  }
  if (!cast[startYKey]) {
    cast[startYKey] = clientY;
  }

  const fraction = getSwipeFraction(element, clientX, clientY);
  const swipeFraction = Math.max(
    Math.min(fraction, swipeFractionMax),
    swipeFractionMin
  );
  if (element[internal.state].swipeFraction === swipeFraction) {
    // Already at min or max; no need for us to do anything.
    return false;
  }

  // If we get this far, we have a touch event we want to handle.

  // From this point on, swiping will take precedence over scrolling.
  cast[deferToScrollingKey] = false;

  element[internal.setState]({ swipeFraction });

  // Indicate that the event was handled. It'd be nicer if we didn't have
  // to do this so that, e.g., a user could be swiping left and right
  // while simultaneously scrolling up and down. (Native touch apps can do
  // that.) However, Mobile Safari wants to handle swipe events near the
  // page and interpret them as navigations. To avoid having a horiziontal
  // swipe misintepreted as a navigation, we indicate that we've handled
  // the event, and prevent default behavior.
  return true;
}

/**
 * Invoked when the user has finished a touch operation.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} clientX
 * @param {number} clientY
 * @param {EventTarget} eventTarget
 */
/* eslint-disable no-unused-vars */
function gestureEnd(element, clientX, clientY, eventTarget) {
  // Examine velocity of last movement to see if user is flicking.
  const velocity = /** @type {any} */ (element)[previousVelocityKey];
  const flickThresholdVelocity = 800; // speed in pixels/second

  const { swipeAxis, swipeFraction } = element[internal.state];
  const vertical = swipeAxis === "vertical";

  // Scrolling takes precedence over flick gestures.
  let willScroll = false;
  if (element[deferToScrollingKey]) {
    // Predict whether the browser's default behavior for this event would cause
    // the swipe target or any of its ancestors to scroll.
    const downOrRight = velocity < 0;
    willScroll = canScrollInDirection(eventTarget, swipeAxis, downOrRight);
  }

  // We only count a flick if the swipe wasn't already going in the opposite
  // direction. E.g., if the user begins a swipe to the left, then flicks right,
  // that doesn't count, because the user may have simply been trying to
  // undo/cancel the swipe to the left.
  if (!willScroll) {
    let flickPositive;
    if (velocity >= flickThresholdVelocity && swipeFraction >= 0) {
      // Flicked right/down at high speed.
      flickPositive = true;
      if (vertical) {
        element[internal.setState]({
          swipeDownWillCommit: true
        });
      } else {
        element[internal.setState]({
          swipeRightWillCommit: true
        });
      }
    } else if (velocity <= -flickThresholdVelocity && swipeFraction <= 0) {
      // Flicked left/up at high speed.
      flickPositive = false;
      if (vertical) {
        element[internal.setState]({
          swipeUpWillCommit: true
        });
      } else {
        element[internal.setState]({
          swipeLeftWillCommit: true
        });
      }
    } else {
      // Finished at low speed.
      // If the user swiped far enough to commit a gesture, handle it now.
      if (
        element[internal.state].swipeLeftWillCommit ||
        element[internal.state].swipeUpWillCommit
      ) {
        flickPositive = false;
      } else if (
        element[internal.state].swipeRightWillCommit ||
        element[internal.state].swipeDownWillCommit
      ) {
        flickPositive = true;
      }
    }

    if (typeof flickPositive !== "undefined") {
      const gesture = vertical
        ? flickPositive
          ? internal.swipeDown
          : internal.swipeUp
        : flickPositive
        ? internal.swipeRight
        : internal.swipeLeft;
      // If component has method for indicated gesture, invoke it.
      if (gesture && element[gesture]) {
        element[gesture]();
      }
    }
  }

  /** @type {any} */ (element)[touchSequenceAxisKey] = null;

  element[internal.setState]({
    swipeFraction: null
  });
}

/**
 * Invoked when the user has begun a touch operation.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} clientX
 * @param {number} clientY
 */
function gestureStart(element, clientX, clientY) {
  /** @type {any} */ const cast = element;
  cast[deferToScrollingKey] = true;
  cast[previousTimeKey] = Date.now();
  cast[previousVelocityKey] = 0;
  cast[previousXKey] = clientX;
  cast[previousYKey] = clientY;
  cast[startXKey] = null;
  cast[startYKey] = null;
  cast[touchSequenceAxisKey] = null;

  element[internal.setState]({
    swipeFraction: 0
  });

  // Let component know a swipe is starting.
  if (element[internal.swipeStart]) {
    element[internal.swipeStart](clientX, clientY);
  }
}

/**
 * Return the fraction represented by the swipe to the given x/y.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} x
 * @param {number} y
 */
function getSwipeFraction(element, x, y) {
  const { swipeAxis } = element[internal.state];
  /** @type {any} */ const cast = element;
  const vertical = swipeAxis === "vertical";
  const dragDistance = vertical ? y - cast[startYKey] : x - cast[startXKey];
  const swipeTarget = element[internal.swipeTarget];
  const swipeTargetSize = vertical
    ? swipeTarget.offsetHeight
    : swipeTarget.offsetWidth;
  const fraction = swipeTargetSize > 0 ? dragDistance / swipeTargetSize : 0;
  return fraction;
}
