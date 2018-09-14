import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import TouchSwipeMixin from '../../src/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../../src/TrackpadSwipeMixin.js';


const Base =
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    ReactiveElement
  ));


class SwipeDemo extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      swipeAxis: 'horizontal'
    });
  }

  get swipeAxis() {
    return this.state.swipeAxis;
  }
  set swipeAxis(swipeAxis) {
    this.setState({ swipeAxis });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .section {
          flex: 1;
        }

        #message {
          font-size: smaller;
          padding: 1em;
        }

        #container {
          align-items: center;
          display: flex;
          flex-direction: column;
          font-size: 48px;
          justify-content: center;
          text-align: center;
        }

        #block {
          background: linear-gradient(to right, lightgray, gray);
          height: 1em;
          width: 100%;
          will-change: transform;
        }
      </style>
      <div class="section">
        <div id="message">
          <slot></slot>
        </div>
      </div>
      <div id="container" class="section">
        <div id="swipeFraction"></div>
        <div id="block"></div>
        <div id="space">&nbsp;</div>
      </div>
      <div id="empty" class="section"></div>
    `;
  }

  get updates() {
    const vertical = this.state.swipeAxis === 'vertical';

    const swipeFraction = this.state.swipeFraction;
    const formatted = swipeFraction !== null ?
      swipeFraction.toFixed(3) :
      '—';
    const axis = vertical ? 'Y' : 'X';
    const transform = swipeFraction !== null ?
      `translate${axis}(${swipeFraction * 100}%)` :
      'none';
    return merge(super.updates, {
      style: {
        'flex-direction': vertical ? 'row' : 'column'
      },
      $: {
        block: {
          style: {
            height: vertical ? '100%' : '1em',
            transform,
            width: vertical ? '1em' : '100%'
          }
        },
        container: {
          style: {
            'flex-direction': vertical ? 'row-reverse' : 'column',
            'justify-content': vertical ? 'flex-end' : 'center'
          }
        },
        empty: {
          style: {
            display: vertical ? 'none' : 'block'
          }
        },
        space: {
          style: {
            display: vertical ? 'none' : 'block'
          }
        },
        swipeFraction: {
          textContent: formatted
        }
      }
    });
  }

}


customElements.define('swipe-demo', SwipeDemo);
export default SwipeDemo;
