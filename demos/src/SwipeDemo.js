import TouchSwipeMixin from '../../mixins/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../../mixins/TrackpadSwipeMixin.js';
import * as props from '../../mixins/props.js';
import symbols from '../../mixins/symbols.js';
import ElementBase from '../../elements/ElementBase.js';


const Base =
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    ElementBase
  ));


class SwipeDemo extends Base {

  get props() {
    return props.merge(super.props, {
      $: {
        swipeFraction: {
          textContent: this.state.swipeFraction
        }
      }
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          align-items: center;
          display: flex;
        }

        #swipeFraction {
          flex: 1;
          font-size: 48px;
          text-align: center;
        }
      </style>
      <div id="swipeFraction"></div>
    `;
  }

}


customElements.define('swipe-demo', SwipeDemo);
export default SwipeDemo;
