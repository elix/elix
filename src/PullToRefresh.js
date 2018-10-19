import { dampen } from './fractionalSelection.js';
import { getScrollableElement } from './scrolling.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
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

const Base =
  EffectMixin(
  TouchSwipeMixin(
    ReactiveElement
  ));


/**
 * Lets the user refresh content with a swipe down gesture
 * 
 * The user can trigger the refresh of data by swiping down until a particular
 * threshold has been reached.
 * 
 * @inherits ReactiveElement
 * @mixes EffectMixin
 * @mixes TouchSwipeMixin
 * @elementrole pullIndicator
 * @elementrole {ProgressSpinner} refreshingIndicator
 */
class PullToRefresh extends Base {

  constructor() {
    super();
    // This role is already applied in the template.
    this[symbols.renderedRoles] = {
      refreshingIndicatorRole: ProgressSpinner
    };
  }

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].pullIndicatorRole !== this.state.pullIndicatorRole) {
      template.transmute(this.$.pullIndicator, this.pullIndicatorRole);
      this[symbols.renderedRoles].pullIndicatorRole = this.state.pullIndicatorRole;
    }
    if (this[symbols.renderedRoles].refreshingIndicatorRole !== this.state.refreshingIndicatorRole) {
      template.transmute(this.$.refreshingIndicator, this.refreshingIndicatorRole);
      this[symbols.renderedRoles].refreshingIndicatorRole = this.state.refreshingIndicatorRole;
    }
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Listen to scroll events in case the user scrolls up past the page's top.
    let scrollTarget = getScrollableElement(this) || window;
    scrollTarget.addEventListener('scroll', async () => {
      this[symbols.raiseChangeEvents] = true;
      await handleScrollPull(this, scrollTarget);
      this[symbols.raiseChangeEvents] = false;
    });
  }

  componentDidUpdate(previousState) {
    if ( this.state.swipeFraction > 0 &&
      !this.state.refreshing && !this.state.refreshTriggered) {
      const y = getTranslationForSwipeFraction(this);
      if (y >= getSwipeThreshold(this)) {
        // User has dragged element down far enough to trigger a refresh.
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
      pullIndicatorRole: downArrowTemplate,
      refreshing: false,
      refreshingIndicatorRole: ProgressSpinner,
      refreshTriggered: false,
      scrollPullDistance: null,
      scrollPullMaxReached: false,
      swipeAxis: 'vertical'
    });
  }

  /**
   * The class, tag, or template used for the element shown to let the user
   * know they can pull to refresh.
   * 
   * By default, this is a down arrow icon.
   * 
   * @type {function|string|HTMLTemplateElement}
   */
  get pullIndicatorRole() {
    return this.state.pullIndicatorRole;
  }
  set pullIndicatorRole(pullIndicatorRole) {
    this.setState({ pullIndicatorRole });
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

  /**
   * The class, tag, or template used for the element shown to indicate the
   * element is currently refreshing.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default ProgressSpinner
   */
  get refreshingIndicatorRole() {
    return this.state.refreshingIndicatorRole;
  }
  set refreshingIndicatorRole(refreshingIndicatorRole) {
    this.setState({ refreshingIndicatorRole });
  }

  get [symbols.template]() {
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

      <div id="refreshHeader">
        <div id="refreshIndicators">
          <div id="pullIndicator"></div>
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
      y = Math.max(y, getSwipeThreshold(this));
    }
    const transform = `translate3D(0, ${y}px, 0)`;
    const showTransition = this.state.enableEffects && !swipingDown;
    const transition = showTransition ?
      'transform 0.25s' :
      'none';
    const showPullIndicator = !this.state.refreshing &&
      !this.state.refreshTriggered &&
      pullingDown;
    const showRefreshingIndicator = this.state.refreshing;
    return merge(super.updates, {
      style: {
        transform,
        transition
      },
      $: {
        pullIndicator: {
          style: {
            visibility: showPullIndicator ? 'visible' : 'hidden'
          }
        },
        refreshingIndicator: Object.assign(
          {
            style: {
              visibility: showRefreshingIndicator ? 'visible' : 'hidden'
            }
          },
          'playing' in this.$.refreshingIndicator && {
            playing: showRefreshingIndicator
          }
        )
      }
    });
  }

}


// Calculate how far the user must drag before we trigger a refresh.
function getSwipeThreshold(element) {
  return element.$.refreshIndicators instanceof HTMLElement ?
    element.$.refreshIndicators.offsetHeight :
    0;
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
async function handleScrollPull(element, scrollTarget) {
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
    await element.setState({ scrollPullDistance });
  } else if (element.state.scrollPullDistance !== null) {
    // We've scrolled back into zero/positive territory, i.e., at or below the
    // top of the page, so the scroll pull has finished.
    await element.setState({
      scrollPullDistance: null,
      scrollPullMaxReached: false,
    });
  }
}


customElements.define('elix-pull-to-refresh', PullToRefresh);
export default PullToRefresh;
