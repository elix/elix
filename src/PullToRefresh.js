import { dampen } from './fractionalSelection.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import defaultScrollTarget from './defaultScrollTarget.js';
import ReactiveElement from './ReactiveElement.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';


const refreshStates = {
  notStarted: 'notStarted',
  started: 'started',
  done: 'done'
};


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
    
    let scrollTarget = defaultScrollTarget(this);
    if (scrollTarget === this) {
      scrollTarget = window;
    }
    scrollTarget.addEventListener('scroll', event => {
      const scrollTop = scrollTarget === window ?
        document.body.scrollTop :
        scrollTarget.scrollTop;
      if (scrollTop < 0) {
        // Most likely in WebKit.
        // Simulate a drag in progress.
        let scrollPullDistance = -scrollTop;
        if (this.state.scrollPullDistance && 
          !this.state.scrollPullFinished &&
          scrollPullDistance < this.state.scrollPullDistance) {
          this.setState({ scrollPullFinished: true });
        }
        this.setState({ scrollPullDistance });
      } else if (this.state.scrollPullDistance !== null) {
        this.setState({
          scrollPullDistance: null,
          scrollPullFinished: false,
        });
      }
    });
    // TODO: Don't show "Pull to Refresh" indicator until closing transition finishes.
    // this.addEventListener('transitionend', () => {
    // });
  }

  componentDidUpdate(previousState) {
    const swipeFraction = this.state.swipeFraction || 0;
    const refreshState = this.state.refresh;
    if (refreshState === refreshStates.notStarted &&
        swipeFraction > 0) {
      const y = getTranslationForSwipeFraction(this);
      const threshold = this.$.refreshIndicator.offsetHeight;
      if (y >= threshold) {
        this.refresh();
      }
    }
  }
  
  get defaultState() {
    // Suppress transition effects on page load.
    return Object.assign({}, super.defaultState, {
      enableTransitions: false,
      refresh: refreshStates.notStarted,
      scrollPullDistance: null,
      scrollPullFinished: false,
      swipeAxis: 'vertical'
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    if (state.swipeFraction === null && state.refresh === refreshStates.done) {
      state.refresh = refreshStates.notStarted;
      result = false;
    }
    return result;
  }

  refresh() {
    this.setState({
      refresh: refreshStates.started
    });
    setTimeout(() => {
      this.setState({
        refresh: refreshStates.done
      });
    }, 2000);
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: block;
          overflow: visible;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          touch-action: manipulation;
        }

        #refreshHeader {
          background: #e0e0e0;
          color: #404040;
          display: flex;
          flex-direction: column-reverse;
          height: 100vh;
          left: 0;
          overflow: visible;
          position: absolute;
          text-align: center;
          top: 0;
          transform: translateY(-100%);
          width: 100%;
        }

        #refreshIndicator {
          box-sizing: border-box;
          padding: 1em;
        }
      </style>

      <div id="refreshHeader">
        <div id="refreshIndicator"></div>
      </div>
      <slot></slot>
    `;
  }

  get updates() {
    const swipingDown = this.state.swipeFraction != null && this.state.swipeFraction > 0;
    let y = getTranslationForSwipeFraction(this);
    if (this.state.refresh === refreshStates.started) {
      y = Math.max(y, 47);
    }
    const transform = `translate3D(0, ${y}px, 0)`;
    const showTransition = this.state.enableTransitions && !swipingDown; // && this.state.scrollPullDistance === null;
    const transition = showTransition ?
      'transform 0.25s' :
      'none';
    const refreshIndicators = {
      notStarted: 'Pull to refresh',
      started: 'Refreshing',
      done: 'Done'
    };
    const indicator = refreshIndicators[this.state.refresh];
    return merge(super.updates, {
      style: {
        'touch-action': '',
        transform,
        transition
      },
      $: {
        refreshIndicator: {
          textContent: indicator
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
    scrollPullFinished
  } = element.state;
  // When damping, we halve the swipe fraction so the user has to drag twice as
  // far to get the usual damping. This produces the feel of a tighter, less
  // elastic surface.
  let result = swipeFraction ?
    element[symbols.swipeTarget].offsetHeight * dampen(swipeFraction / 2) :
    0;
  if (!scrollPullFinished && scrollPullDistance) {
    result += scrollPullDistance;
  }
  return result;
}


customElements.define('elix-pull-to-refresh', PullToRefresh);
export default PullToRefresh;
