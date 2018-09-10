import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  OpenCloseMixin(
    ReactiveElement
  );


/**
 * @inherits ReactiveElement
 */
class PullToRefresh extends Base {

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          overflow-y: scroll;
        }

        #pullToRefreshContainer {
          background: #eee;
          transform: translateY(0px);
          transition: transform 0.3s;
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

  get updates() {
    const transform = this.opened ?
      'translateY(17px)' :
      'translateY(0)';
    return merge(super.updates, {
      $: {
        pullToRefreshContainer: {
          style: {
            transform
          }    
        }
      }
    });
  }

}

customElements.define('elix-pull-to-refresh', PullToRefresh);
export default PullToRefresh;
