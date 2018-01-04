import { merge } from './updates.js';
import ElementBase from './ElementBase.js';
import symbols from './symbols.js';


/**
 * The backdrop shown behind a [Dialog](Dialog).
 * 
 * @inherits ElementBase
 * 
 */
class ModalBackdrop extends ElementBase {

  get [symbols.template]() {
    return `
      <style>
        :host {
          background: black;
          height: 100%;
          left: 0;
          opacity: 0.2;
          position: absolute;
          top: 0;
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


customElements.define('elix-modal-backdrop', ModalBackdrop);
export default ModalBackdrop;
