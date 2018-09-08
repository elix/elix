// import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * @inherits ReactiveElement
 */
class PullToRefresh extends ReactiveElement {

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          overflow-y: scroll;
        }

        #pullToRefreshContainer {
          background: #eee;
          transform: translateY(0px);
        }

        #refreshHeader {
          background: pink;
          position: absolute;
          /* top: -17px; */
          transform: translateY(-100%);
          width: 100%;
        }
      </style>
      <div id="pullToRefreshContainer">
        <div id="refreshHeader">
          Secret stuff goes here
        </div>
        <slot></slot>
      </div>
    `;
  }

  // get updates() {
  //   return merge(super.updates, {
  //   });
  // }

}

customElements.define('elix-pull-to-refresh', PullToRefresh);
export default PullToRefresh;
