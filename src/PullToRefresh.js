import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
// import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import { dampen } from './fractionalSelection.js';


const refreshStates = {
  notStarted: 'notStarted',
  started: 'started',
  done: 'done'
};


const Base =
  // OpenCloseMixin(
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
  }

  get defaultState() {
    // Suppress transition effects on page load.
    return Object.assign({}, super.defaultState, {
      enableTransitions: false,
      refresh: refreshStates.notStarted,
      swipeAxis: 'vertical'
    });
  }

  componentDidUpdate(previousState) {
    const swipeFraction = this.state.swipeFraction || 0;
    const refreshState = this.state.refresh;
    if (refreshState === refreshStates.notStarted &&
        swipeFraction > 0) {
      const y = getTranslationForSwipeFraction(this, this.state.swipeFraction);
      const threshold = this.$.refreshHeader.offsetHeight;
      if (y >= threshold) {
        this.refresh();
      }
    }
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
          display: inline-block;
          overflow-y: scroll;
        }

        #refreshHeader {
          box-sizing: border-box;
          color: #404040;
          padding: 1em;
          position: absolute;
          text-align: center;
          transform: translateY(-100%);
          width: 100%;
        }

        #pullToRefreshContent {
          background: white;
        }
      </style>
      <div id="pullToRefreshContainer">
        <div id="refreshHeader"></div>
        <div id="pullToRefreshContent">
          <slot></slot>
        </div>
      </div>
    `;
  }

  get updates() {
    const swiping = this.state.swipeFraction != null;
    let y = getTranslationForSwipeFraction(this, this.state.swipeFraction);
    if (this.state.refresh === refreshStates.started) {
      y = Math.max(y, 47);
    }
    const transform = y !== 0 ?
      `translateY(${y}px)` :
      'none';
    const showTransition = this.state.enableTransitions && !swiping;
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
      $: {
        pullToRefreshContainer: {
          style: {
            transform,
            transition
          }    
        },
        refreshHeader: {
          textContent: indicator
        }
      }
    });
  }

}


// For a given swipe fraction (percentage of the element's swipe target's
// height), return the distance of the vertical translation we should apply to
// the swipe target.
function getTranslationForSwipeFraction(element, swipeFraction) {
  // When damping, we halve the swipe fraction so the user has to drag twice as
  // far to get the usual damping. This produces the feel of a tighter, less
  // elastic surface.
  return swipeFraction === 0 ?
    0 :
    element[symbols.swipeTarget].offsetHeight * dampen(swipeFraction / 2);
}


customElements.define('elix-pull-to-refresh', PullToRefresh);
export default PullToRefresh;
