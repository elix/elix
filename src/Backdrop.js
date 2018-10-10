import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * Background element shown behind an overlay's primary content
 * 
 * The backdrop is transparent by default, suggesting to the user that the
 * overlay is modeless, and they can click through it to reach the background
 * elements. For a modal variant, see [ModalBackdrop](ModalBackdrop).
 * 
 * @inherits ReactiveElement
 */
class Backdrop extends ReactiveElement {

  get [symbols.template]() {
    return template.html`
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
