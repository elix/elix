import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import TouchSwipeMixin from '../../src/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../../src/TrackpadSwipeMixin.js';


const Base =
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    ReactiveElement
  ));


class SwipeDemo extends Base {

  get [symbols.template]() {
    return `
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
          This demo shows how a component can use TouchSwipeMixin and
          TrackpadSwipeMixin to listen to horizontal touch swipes and trackpad
          swipes, respectively. Swiping with either input method will show the
          current swipe distance as a fraction of the demo width. It will also
          translate the gray block by that fraction so the user feels like they
          are directly moving the block.
        </div>
      </div>
      <div id="container" class="section">
        <div id="swipeFraction"></div>
        <div id="block"></div>
        <div>&nbsp;</div>
      </div>
      <div class="section"></div>
    `;
  }

  get updates() {
    const swipeFraction = this.state.swipeFraction;
    const formatted = swipeFraction !== null ?
      swipeFraction.toFixed(3) :
      '—';
    const transform = swipeFraction !== null ?
      `translateX(${swipeFraction * 100}%)` :
      'none';
    return merge(super.updates, {
      $: {
        block: {
          style: {
            transform
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
