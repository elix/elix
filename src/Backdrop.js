import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';
import { html } from './templates.js';
import { merge } from './updates.js';


/**
 * A simple backdrop for an overlay. The backdrop is transparent, suggesting to
 * the user that they can click through it to reach the background elements.
 * 
 * @inherits ReactiveElement
 */
class Backdrop extends ReactiveElement {

  get [symbols.template]() {
    return html`
      <style>
        :host {
          height: 100%;
          left: 0;
          position: fixed;
          top: 0;
          touch-action: manipulation;
          width: 100%;
        }
      </style>
      <slot></slot>
    `;
  }

  get updates() {
    const base = super.updates || {};
    const role = base.attributes && base.attributes.role || 'none';
    return merge(base, {
      attributes: {
        role
      }
    });
  }

}


customElements.define('elix-backdrop', Backdrop);
export default Backdrop;
