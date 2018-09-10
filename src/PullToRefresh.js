import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';


const openTimeoutKey = Symbol('openTimeout');


const Base =
  OpenCloseMixin(
  TouchSwipeMixin(
    ReactiveElement
  ));


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
      swipeAxis: 'vertical'
    });
  }

  componentDidUpdate(previousState) {
    const swipeFraction = this.state.swipeFraction || 0;
    if (this.closed && this.state.swipeFraction > 0) {
      const y = this[symbols.swipeTarget].offsetHeight * swipeFraction;
      const threshold = this.$.refreshHeader.offsetHeight;
      if (y >= threshold) {
        this.open();
      }
    }
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          overflow-y: scroll;
        }

        #pullToRefreshContainer {
          background: #eee;
        }

        #refreshHeader {
          background: pink;
          box-sizing: border-box;
          padding: 1em;
          position: absolute;
          text-align: center;
          transform: translateY(-100%);
          width: 100%;
        }
      </style>
      <div id="pullToRefreshContainer">
        <div id="refreshHeader"></div>
        <slot></slot>
      </div>
    `;
  }

  get updates() {
    const swiping = this.state.swipeFraction != null;
    const swipeFraction = this.state.swipeFraction || 0;
    let y;
    y = this[symbols.swipeTarget].offsetHeight * swipeFraction;
    if (this.opened) {
      y = Math.max(y, 47);
    }
    const transform = y !== 0 ?
      `translateY(${y}px)` :
      'none';
    const showTransition = this.state.enableTransitions && !swiping;
    const transition = showTransition ?
      'transform 0.25s' :
      'none';
    const indicator = this.opened ? 'Opened' : 'Closed';
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

customElements.define('elix-pull-to-refresh', PullToRefresh);
export default PullToRefresh;
