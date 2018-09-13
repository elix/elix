import './ProgressSpinner.js';
import { dampen } from './fractionalSelection.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import { getScrollingParent } from './scrolling.js';
import ReactiveElement from './ReactiveElement.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import { raiseChangeEvents } from './symbols.js';


const Base =
  TouchSwipeMixin(
    ReactiveElement
  );


/**
 * @inherits ReactiveElement
 */
class PullToRefresh extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Once everything's finished rendering, enable transition effects.
    setTimeout(() => {
      this.setState({
        enableTransitions: true
      });
    });

    // Listen to scroll events in case the user scrolls up past the page's top.
    let scrollTarget = getScrollingParent(this) || window;
    scrollTarget.addEventListener('scroll', () => {
      this[symbols.raiseChangeEvents] = true;
      handleScrollPull(this, scrollTarget);
      this[symbols.raiseChangeEvents] = false;
    });
  }

  componentDidUpdate(previousState) {
    if ( this.state.swipeFraction > 0 &&
      !this.state.refreshing && !this.state.refreshTriggered) {
      const y = getTranslationForSwipeFraction(this);
      const threshold = this.$.refreshIndicators.offsetHeight;
      if (y >= threshold) {
        this.refreshing = true;
      }
    } else if (this.state.refreshing !== previousState.refreshing) {
      if (this[symbols.raiseChangeEvents]) {
        const event = new CustomEvent('refreshing-changed', {
          detail: {
            refreshing: this.state.refreshing
          }
        });
        this.dispatchEvent(event);
      }
    }
  }
  
  get defaultState() {
    // Suppress transition effects on page load.
    return Object.assign({}, super.defaultState, {
      enableNegativeSwipe: false,
      enableTransitions: false,
      refreshTriggered: false,
      refreshing: false,
      scrollPullDistance: null,
      scrollPullMaxReached: false,
      swipeAxis: 'vertical'
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    if (state.refreshing && !state.refreshTriggered) {
      state.refreshTriggered = true;
      result = false;
    } else if (state.swipeFraction === null && !state.refreshing &&
        state.refreshTriggered) {
      state.refreshTriggered = false;
      result = false;
    }
    return result;
  }

  get refreshing() {
    return this.state.refreshing;
  }
  set refreshing(refreshing) {
    this.setState({ refreshing });
  }

  // TODO: Role for spinner, etc.
  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: block;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }

        #refreshHeader {
          align-items: center;
          display: flex;
          flex-direction: column-reverse;
          height: 100vh;
          left: 0;
          overflow: visible;
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

        #downArrow {
          fill: #404040;
          height: 24px;
          width: 24px;
        }
      </style>

      <div id="refreshHeader">
        <div id="refreshIndicators">
          <div id="startIndicator">
            <svg id="downArrow" viewBox="0 0 24 24">
              <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
            </svg>
          </div>
          <elix-progress-spinner id="refreshingIndicator"></elix-progress-spinner>
        </div>
      </div>
      <slot></slot>
    `;
  }

  get updates() {
    const swipingDown = this.state.swipeFraction != null && this.state.swipeFraction > 0;
    const scrollingDown = !!this.state.scrollPullDistance;
    const pullingDown = swipingDown || scrollingDown;
    let y = getTranslationForSwipeFraction(this);
    if (this.state.refreshing) {
      // TODO
      y = Math.max(y, 57);
    }
    const transform = `translate3D(0, ${y}px, 0)`;
    const showTransition = this.state.enableTransitions && !swipingDown;
    const transition = showTransition ?
      'transform 0.25s' :
      'none';
    const showStartIndicator = !this.state.refreshing &&
      !this.state.refreshTriggered &&
      pullingDown;
    const showRefreshingIndicator = this.state.refreshing;
    return merge(super.updates, {
      style: {
        transform,
        transition
      },
      $: {
        startIndicator: {
          style: {
            display: showStartIndicator ? 'block' : 'none'
          }
        },
        refreshingIndicator: {
          style: {
            display: showRefreshingIndicator ? 'block' : 'none'
          },
          playing: showRefreshingIndicator
        }
      }
    });
  }

}


// For a given swipe fraction (percentage of the element's swipe target's
// height), return the distance of the vertical translation we should apply to
// the swipe target.
function getTranslationForSwipeFraction(element) {

  const {
    swipeFraction,
    scrollPullDistance,
    scrollPullMaxReached
  } = element.state;

  // When damping, we halve the swipe fraction so the user has to drag twice as
  // far to get the usual damping. This produces the feel of a tighter, less
  // elastic surface.
  let result = swipeFraction ?
    element[symbols.swipeTarget].offsetHeight * dampen(swipeFraction / 2) :
    0;

  if (!scrollPullMaxReached && scrollPullDistance) {
    result += scrollPullDistance;
  }

  return result;
}


// If a user flicks down to quickly scroll up, and scrolls past the top of the
// page, the area above the page may be shown briefly. We use that opportunity
// to show the user the refresh header so they'll realize they can pull to
// refresh. We call this operation a "scroll pull". It works a little like a
// real touch drag, but cannot trigger a refresh.
//
// We can only handle a scroll pull in a browser like Mobile Safari that gives
// us scroll events past the top of the page.
//
function handleScrollPull(element, scrollTarget) {

  const scrollTop = scrollTarget === window ?
    document.body.scrollTop :
    scrollTarget.scrollTop;

  if (scrollTop < 0) {
    // Negative scroll top means we're probably in WebKit.
    // Start a scroll pull operation.
    let scrollPullDistance = -scrollTop;
    if (element.state.scrollPullDistance &&
      !element.state.scrollPullMaxReached &&
      scrollPullDistance < element.state.scrollPullDistance) {
      // The negative scroll events have started to head back to zero (most
      // likely because the user let go and stopped scrolling), so we've reached
      // the maximum extent of the scroll pull. From this point on, we want to
      // stop our own translation effect and let the browser smoothly snap the
      // page back to the top (zero) scroll position. If we don't do that, we'll
      // be fighting with the browser effect, and the result will not be smooth.
      element.setState({ scrollPullMaxReached: true });
    }
    element.setState({ scrollPullDistance });
  } else if (element.state.scrollPullDistance !== null) {
    // We've scrolled back into zero/positive territory, i.e., at or below the
    // top of the page, so the scroll pull has finished.
    element.setState({
      scrollPullDistance: null,
      scrollPullMaxReached: false,
    });
  }
}


customElements.define('elix-pull-to-refresh', PullToRefresh);
export default PullToRefresh;
