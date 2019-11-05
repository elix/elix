import { dampen } from './fractionalSelection.js';
import { getScrollableElement } from './scrolling.js';
import * as internal from './internal.js';
import * as template from './template.js';
import EffectMixin from './EffectMixin.js';
import ProgressSpinner from './ProgressSpinner.js';
import ReactiveElement from './ReactiveElement.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';

// Template for the default down arrow shown while pulling.
const downArrowTemplate = template.html`
  <svg viewBox="0 0 24 24" style="fill: #404040; height: 24px; width: 24px;">
    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
  </svg>
`;

const Base = EffectMixin(TouchSwipeMixin(ReactiveElement));

/**
 * Lets the user refresh content with a swipe down gesture
 *
 * The user can trigger the refresh of data by swiping down until a particular
 * threshold has been reached.
 *
 * @inherits ReactiveElement
 * @mixes EffectMixin
 * @mixes TouchSwipeMixin
 * @part indicator - either of the pull or refreshing indicators
 * @part refresh-header - the header area shown when the user pulls down
 * @part pull-indicator - the element shown to let the user know they can pull down
 * @part {ProgressSpinner} refreshing-indicator - the element shown during a refresh of the content
 */
class PullToRefresh extends Base {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();
    // Listen to scroll events in case the user scrolls up past the page's top.
    let scrollTarget = getScrollableElement(this) || window;
    scrollTarget.addEventListener('scroll', async () => {
      // We might normally call requestAnimationFrame in a scroll handler, but
      // in this case that could cause our scroll handling to run after the user
      // has scrolled away from the top.
      this[internal.raiseChangeEvents] = true;
      // Desktop and Mobile Safari don't agree on how to expose document
      // scrollTop, so we use window.pageYOffset.
      // See https://stackoverflow.com/questions/2506958/how-to-find-in-javascript-the-current-scroll-offset-in-mobile-safari-iphon
      const scrollTop =
        scrollTarget instanceof Window
          ? window.pageYOffset
          : scrollTarget.scrollTop;
      await handleScrollPull(this, scrollTop);
      this[internal.raiseChangeEvents] = false;
    });
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);
    if (
      this[internal.state].swipeFraction > 0 &&
      !this[internal.state].refreshing &&
      !this[internal.state].pullTriggeredRefresh
    ) {
      const y = getTranslationForSwipeFraction(
        this[internal.state],
        this[internal.swipeTarget]
      );
      if (y >= getSwipeThreshold(this)) {
        // User has dragged element down far enough to trigger a refresh.
        this.refreshing = true;
      }
    } else if (changed.refreshing) {
      if (this[internal.raiseChangeEvents]) {
        /**
         * Raised when the `refreshing` state changes.
         *
         * @event refreshing-changed
         */
        const event = new CustomEvent('refreshing-changed', {
          detail: {
            refreshing: this[internal.state].refreshing
          }
        });
        this.dispatchEvent(event);
      }
    }
  }

  get [internal.defaultState]() {
    // Suppress transition effects on page load.
    const state = Object.assign(super[internal.defaultState], {
      swipeFractionMin: 0, // Can't swipe up, only down
      pullIndicatorPartType: downArrowTemplate,
      pullTriggeredRefresh: false,
      refreshing: false,
      refreshingIndicatorPartType: ProgressSpinner,
      scrollPullDistance: null,
      scrollPullMaxReached: false,
      swipeAxis: 'vertical'
    });

    // We use a pullTriggeredRefresh flag to track whether the current pull
    // gesture has already triggered a refresh. If the user pulls down far
    // enough to trigger a refresh, and the refresh completes while the user is
    // still pulling down, we don't want further pulling to trigger a second
    // refresh.
    state.onChange(['refreshing', 'swipeFraction'], (state, changed) => {
      const { refreshing, swipeFraction } = state;
      if (changed.refreshing && refreshing) {
        // We've started a refresh; set flag.
        return {
          pullTriggeredRefresh: true
        };
      } else if (swipeFraction === null && !state.refreshing) {
        // We're neither pulling nor refreshing, so reset flag.
        return {
          pullTriggeredRefresh: false
        };
      }
      return null;
    });

    return state;
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.pullIndicatorPartType) {
      template.transmute(
        this[internal.ids].pullIndicator,
        this.pullIndicatorPartType
      );
    }
    if (changed.refreshing) {
      const { refreshing } = this[internal.state];
      const refreshingIndicator = this[internal.ids].refreshingIndicator;
      refreshingIndicator.style.visibility = refreshing ? 'visible' : 'hidden';
      if ('playing' in this[internal.ids].refreshingIndicator) {
        /** @type {any} */ (refreshingIndicator).playing = refreshing;
      }
    }
    if (changed.refreshingIndicatorPartType) {
      template.transmute(
        this[internal.ids].refreshingIndicator,
        this.refreshingIndicatorPartType
      );
    }
    if (changed.enableEffects || changed.refreshing || changed.swipeFraction) {
      const { enableEffects, refreshing, swipeFraction } = this[internal.state];
      const swipingDown = swipeFraction != null && swipeFraction > 0;
      let y = getTranslationForSwipeFraction(
        this[internal.state],
        this[internal.swipeTarget]
      );
      if (refreshing) {
        y = Math.max(y, getSwipeThreshold(this));
      }
      const showTransition = enableEffects && !swipingDown;
      Object.assign(this.style, {
        transform: `translate3D(0, ${y}px, 0)`,
        transition: showTransition ? 'transform 0.25s' : null
      });
    }
    if (
      changed.pullTriggeredRefresh ||
      changed.refreshing ||
      changed.scrollPullDistance ||
      changed.swipeFraction
    ) {
      const {
        pullTriggeredRefresh,
        refreshing,
        scrollPullDistance,
        swipeFraction
      } = this[internal.state];
      const swipingDown = swipeFraction != null && swipeFraction > 0;
      const scrollingDown = !!scrollPullDistance;
      const pullingDown = swipingDown || scrollingDown;
      const showPullIndicator =
        !refreshing && !pullTriggeredRefresh && pullingDown;
      this[internal.ids].pullIndicator.style.visibility = showPullIndicator
        ? 'visible'
        : 'hidden';
    }
  }

  /**
   * The class, tag, or template used to create the `pull-indicator` part – the
   * element that lets the user know they can pull to refresh.
   *
   * By default, this is a down arrow icon.
   *
   * @type {PartDescriptor}
   */
  get pullIndicatorPartType() {
    return this[internal.state].pullIndicatorPartType;
  }
  set pullIndicatorPartType(pullIndicatorPartType) {
    this[internal.setState]({ pullIndicatorPartType });
  }

  get refreshing() {
    return this[internal.state].refreshing;
  }
  set refreshing(refreshing) {
    this[internal.setState]({ refreshing });
  }

  /**
   * The class, tag, or template used to create the `refreshing-indicator` part
   * – the element shown to let the user know the element is currently
   * refreshing.
   *
   * @type {PartDescriptor}
   * @default ProgressSpinner
   */
  get refreshingIndicatorPartType() {
    return this[internal.state].refreshingIndicatorPartType;
  }
  set refreshingIndicatorPartType(refreshingIndicatorPartType) {
    this[internal.setState]({ refreshingIndicatorPartType });
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: block;
        }

        #refreshHeader {
          align-items: center;
          display: flex;
          flex-direction: column-reverse;
          height: 100vh;
          left: 0;
          position: absolute;
          top: 0;
          transform: translateY(-100%);
          width: 100%;
        }

        #refreshIndicators {
          align-items: center;
          box-sizing: border-box;
          display: grid;
          justify-items: center;
          padding: 1em;
        }

        #refreshIndicators > * {
          grid-column: 1;
          grid-row: 1;
        }
      </style>

      <div id="refreshHeader" part="refresh-header">
        <div id="refreshIndicators">
          <div id="pullIndicator" part="indicator pull-indicator"></div>
          <div id="refreshingIndicator" part="indicator refreshing-indicator"></div>
        </div>
      </div>
      <slot></slot>
    `;
  }
}

/**
 * Calculate how far the user must drag before we trigger a refresh.
 *
 * @private
 * @param {PullToRefresh} element
 */
function getSwipeThreshold(element) {
  return element[internal.ids].refreshIndicators instanceof HTMLElement
    ? element[internal.ids].refreshIndicators.offsetHeight
    : 0;
}

/**
 * For a given swipe fraction (percentage of the element's swipe target's
 * height), return the distance of the vertical translation we should apply to
 * the swipe target.
 *
 * @private
 * @param {PlainObject} state
 * @param {HTMLElement} swipeTarget
 */
function getTranslationForSwipeFraction(state, swipeTarget) {
  const { swipeFraction, scrollPullDistance, scrollPullMaxReached } = state;

  // When damping, we halve the swipe fraction so the user has to drag twice as
  // far to get the usual damping. This produces the feel of a tighter, less
  // elastic surface.
  let result = swipeFraction
    ? swipeTarget.offsetHeight * dampen(swipeFraction / 2)
    : 0;

  if (!scrollPullMaxReached && scrollPullDistance) {
    result += scrollPullDistance;
  }

  return result;
}

/**
 * If a user flicks down to quickly scroll up, and scrolls past the top of the
 * page, the area above the page may be shown briefly. We use that opportunity
 * to show the user the refresh header so they'll realize they can pull to
 * refresh. We call this operation a "scroll pull". It works a little like a
 * real touch drag, but cannot trigger a refresh.
 *
 * We can only handle a scroll pull in a browser like Mobile Safari that gives
 * us scroll events past the top of the page.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} scrollTop
 */
async function handleScrollPull(element, scrollTop) {
  if (scrollTop < 0) {
    // Negative scroll top means we're probably in WebKit.
    // Start a scroll pull operation.
    let scrollPullDistance = -scrollTop;
    if (
      element[internal.state].scrollPullDistance &&
      !element[internal.state].scrollPullMaxReached &&
      scrollPullDistance < element[internal.state].scrollPullDistance
    ) {
      // The negative scroll events have started to head back to zero (most
      // likely because the user let go and stopped scrolling), so we've reached
      // the maximum extent of the scroll pull. From this point on, we want to
      // stop our own translation effect and let the browser smoothly snap the
      // page back to the top (zero) scroll position. If we don't do that, we'll
      // be fighting with the browser effect, and the result will not be smooth.
      element[internal.setState]({ scrollPullMaxReached: true });
    }
    await element[internal.setState]({ scrollPullDistance });
  } else if (element[internal.state].scrollPullDistance !== null) {
    // We've scrolled back into zero/positive territory, i.e., at or below the
    // top of the page, so the scroll pull has finished.
    await element[internal.setState]({
      scrollPullDistance: null,
      scrollPullMaxReached: false
    });
  }
}

export default PullToRefresh;
